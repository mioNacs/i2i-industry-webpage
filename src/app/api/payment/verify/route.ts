import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { sendEnrollmentEmail } from '@/lib/email';

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
      // New fields for enhanced enrollment
      leadId,
      paymentType = 'full',
      totalCourseAmount,
      mobileNo,
      alternateMobileNo,
      courseMode,
      courseTitle,
      tierTitle,
      durationMonths,
      durationHours,
      isRemainingPayment = false,
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
      
      // Send failure email
      await sendEnrollmentEmail({
        userEmail: user.email || '',
        userName: user.user_metadata?.full_name || '',
        mobileNo: mobileNo || '',
        alternateMobileNo: alternateMobileNo || undefined,
        courseTitle: courseTitle || '',
        tierTitle: tierTitle || '',
        durationMonths,
        durationHours,
        courseMode: courseMode || '',
        paymentType,
        amountPaid: amount,
        totalAmount: totalCourseAmount || amount,
        remainingAmount: (totalCourseAmount || amount) - amount,
        paymentStatus: 'failed',
        razorpayOrderId: razorpay_order_id,
        errorReason: 'Payment signature verification failed',
      });

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

    // Calculate remaining amount and access grants
    const totalAmount = totalCourseAmount || amount;
    const remainingAmount = paymentType === 'full' ? 0 : totalAmount - amount;
    const isFullPayment = paymentType === 'full' || remainingAmount === 0;

    // Check if this is a remaining payment for an existing enrollment
    if (isRemainingPayment) {
      // Find existing enrollment with partial payment
      const { data: existingEnrollments, error: existingError } = await supabase
        .from('enrollments')
        .select('id, amount_paid')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('tier_id', courseTierId)
        .eq('payment_status', 'completed')
        .eq('full_access_granted', false)
        .order('purchased_at', { ascending: false })
        .limit(1);

      const existingEnrollment = existingEnrollments?.[0];

      if (existingEnrollment) {
        // Update existing enrollment using secure RPC
        const newTotalPaid = (existingEnrollment.amount_paid || 0) + amount;
        const { error: updateError } = await supabase.rpc('update_enrollment_payment_secure', {
            p_enrollment_id: existingEnrollment.id,
            p_new_total_paid: newTotalPaid,
            p_razorpay_order_id: razorpay_order_id,
            p_razorpay_payment_id: razorpay_payment_id,
            p_razorpay_signature: razorpay_signature,
            p_payment_type: 'full',
            p_secret: process.env.RAZORPAY_KEY_SECRET
        });

        if (updateError) {
          console.error('Error updating enrollment:', updateError);
          return NextResponse.json(
            { success: false, error: 'Failed to update enrollment' },
            { status: 500 }
          );
        }

        // Send success email
        await sendEnrollmentEmail({
          userEmail: user.email || '',
          userName: user.user_metadata?.full_name || '',
          mobileNo: mobileNo || '',
          alternateMobileNo: alternateMobileNo || undefined,
          courseTitle: courseTitle || '',
          tierTitle: tierTitle || '',
          durationMonths,
          durationHours,
          courseMode: courseMode || '',
          paymentType: 'full',
          amountPaid: newTotalPaid,
          totalAmount,
          remainingAmount: 0,
          paymentStatus: 'success',
          razorpayPaymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
        });

        return NextResponse.json({
          success: true,
          enrollmentId: existingEnrollment.id,
          message: 'Remaining payment verified. You now have full access!',
          accessLevel: 'full',
        });
      }
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
        // New fields
        lead_id: leadId || null,
        mobile_no: mobileNo || null,
        alternate_mobile_no: alternateMobileNo || null,
        course_mode: courseMode || null,
        course_title: courseTitle || null,
        tier_title: tierTitle || null,
        duration_months: durationMonths || null,
        duration_hours: durationHours || null,
        total_course_amount: totalAmount,
        payment_type: paymentType,
        remaining_amount: remainingAmount,
        partial_access_granted: !isFullPayment,
        full_access_granted: isFullPayment,
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
      paymentType,
      userId: user.id,
    });

    if (enrollmentError) {
      console.error('Error creating enrollment:', enrollmentError);
      
      // Send failure email for enrollment creation error
      await sendEnrollmentEmail({
        userEmail: user.email || '',
        userName: user.user_metadata?.full_name || '',
        mobileNo: mobileNo || '',
        alternateMobileNo: alternateMobileNo || undefined,
        courseTitle: courseTitle || '',
        tierTitle: tierTitle || '',
        durationMonths,
        durationHours,
        courseMode: courseMode || '',
        paymentType,
        amountPaid: amount,
        totalAmount,
        remainingAmount,
        paymentStatus: 'failed',
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        errorReason: `Enrollment creation failed: ${enrollmentError.message}`,
      });

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

    // Update lead conversion status if leadId provided
    if (leadId) {
      await supabase
        .from('enrollment_leads')
        .update({ converted_at: new Date().toISOString() })
        .eq('id', leadId);
    }

    // Send success email
    await sendEnrollmentEmail({
      userEmail: user.email || '',
      userName: user.user_metadata?.full_name || '',
      mobileNo: mobileNo || '',
      alternateMobileNo: alternateMobileNo || undefined,
      courseTitle: courseTitle || '',
      tierTitle: tierTitle || '',
      durationMonths,
      durationHours,
      courseMode: courseMode || '',
      paymentType,
      amountPaid: amount,
      totalAmount,
      remainingAmount,
      paymentStatus: 'success',
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
    });

    return NextResponse.json({
      success: true,
      enrollmentId: enrollment.id,
      message: isFullPayment 
        ? 'Payment verified and enrollment created successfully' 
        : 'Partial payment verified. Complete remaining payment for full access.',
      accessLevel: isFullPayment ? 'full' : 'partial',
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
