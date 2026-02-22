import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Please login to enroll in a course' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { 
      courseId, 
      courseTierId, 
      courseTitle, 
      tierTitle, 
      amount,
      // New fields for enhanced enrollment
      leadId,
      paymentType,
      totalCourseAmount,
      mobileNo,
      alternateMobileNo,
      courseMode,
      durationMonths,
      durationHours,
    } = body;

    // Validate required fields
    if (!courseId || !courseTierId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount (must be positive integer in rupees)
    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // For partial payments, validate the amount is within range
    if (paymentType === 'partial') {
      const BOOK_SLOT_AMOUNT = 5000; // ₹5000 fixed for slot booking
      if (amount < BOOK_SLOT_AMOUNT) {
        return NextResponse.json(
          { success: false, error: 'Slot booking amount is ₹5000' },
          { status: 400 }
        );
      }
      if (totalCourseAmount && amount > totalCourseAmount) {
        return NextResponse.json(
          { success: false, error: 'Partial amount cannot exceed course price' },
          { status: 400 }
        );
      }
    }

    // Check if user already has a completed full payment for this course tier
    const { data: existingEnrollments } = await supabase
      .from('enrollments')
      .select('id, payment_type, full_access_granted')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('tier_id', courseTierId)
      .eq('payment_status', 'completed')
      .eq('full_access_granted', true)
      .limit(1);

    const existingEnrollment = existingEnrollments?.[0];

    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, error: 'You already have full access to this course tier' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    // Receipt must be max 40 chars - use shortened format
    const shortUserId = user.id.slice(0, 8);
    const timestamp = Date.now().toString(36); // Base36 for shorter string
    const receipt = `rcpt_${shortUserId}_${timestamp}`.slice(0, 40);
    
    // Convert rupees to paise for Razorpay (Razorpay requires amount in paise)
    const amountInPaise = amount * 100;
    
    const order = await razorpay.orders.create({
      amount: amountInPaise, // Amount in paise for Razorpay
      currency: 'INR',
      receipt,
      notes: {
        courseId,
        courseTierId,
        userId: user.id,
        courseTitle: courseTitle || '',
        tierTitle: tierTitle || '',
        // New notes for enhanced tracking
        leadId: leadId || '',
        paymentType: paymentType || 'full',
        totalCourseAmount: totalCourseAmount?.toString() || amount.toString(),
        mobileNo: mobileNo || '',
        courseMode: courseMode || '',
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: amountInPaise, // Return paise for Razorpay checkout
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
