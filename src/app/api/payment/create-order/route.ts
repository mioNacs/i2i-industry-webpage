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
    const { courseId, courseTierId, courseTitle, tierTitle, amount } = body;

    // Validate required fields
    if (!courseId || !courseTierId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount (must be positive integer in paise)
    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Check if user is already enrolled
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('tier_id', courseTierId)
      .eq('payment_status', 'completed')
      .single();

    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, error: 'You are already enrolled in this course tier' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    // Receipt must be max 40 chars - use shortened format
    const shortUserId = user.id.slice(0, 8);
    const timestamp = Date.now().toString(36); // Base36 for shorter string
    const receipt = `rcpt_${shortUserId}_${timestamp}`.slice(0, 40);
    
    const order = await razorpay.orders.create({
      amount: amount, // Amount in paise
      currency: 'INR',
      receipt,
      notes: {
        courseId,
        courseTierId,
        userId: user.id,
        courseTitle: courseTitle || '',
        tierTitle: tierTitle || '',
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
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
