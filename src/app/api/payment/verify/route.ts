import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      courseTierId,
      amount,
    } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId || !courseTierId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const body_data = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body_data)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Payment signature verification failed');
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Check if enrollment already exists with this payment
    const { data: existingPayment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .single();

    if (existingPayment) {
      console.log('Payment already processed');
      return NextResponse.json({
        success: true,
        enrollmentId: existingPayment.id,
        message: 'Payment already processed',
      });
    }

    // Create enrollment record with full payment details
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId,
        tier_id: courseTierId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount_paid: amount,
        payment_status: 'completed',
        purchased_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    // Log payment details
    console.log('Payment verified:', {
      razorpay_order_id,
      razorpay_payment_id,
      courseId,
      courseTierId,
      amount,
      userId: user.id,
    });

    if (enrollmentError) {
      console.error('Error creating enrollment:', enrollmentError);
      // If duplicate key error, the enrollment was already created
      if (enrollmentError.code === '23505') {
        return NextResponse.json({
          success: true,
          message: 'Enrollment already exists',
        });
      }
      return NextResponse.json(
        { success: false, error: 'Failed to create enrollment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      enrollmentId: enrollment.id,
      message: 'Payment verified and enrollment created successfully',
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
