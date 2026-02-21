import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
      email,
      fullName,
      mobileNo,
      alternateMobileNo,
      courseId,
      courseTitle,
      tierId,
      tierTitle,
      durationMonths,
      durationHours,
      courseMode,
      totalAmount,
    } = body;

    // Validate required fields
    if (!email || !mobileNo || !courseId || !tierId || !courseMode || !totalAmount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate mobile number format (Indian mobile)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobileNo)) {
      return NextResponse.json(
        { success: false, error: 'Invalid mobile number format' },
        { status: 400 }
      );
    }

    if (alternateMobileNo && !mobileRegex.test(alternateMobileNo)) {
      return NextResponse.json(
        { success: false, error: 'Invalid alternate mobile number format' },
        { status: 400 }
      );
    }

    // Check for existing unconverted lead for this course
    const { data: existingLeads } = await supabase
      .from('enrollment_leads')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('tier_id', tierId)
      .is('converted_at', null)
      .order('created_at', { ascending: false })
      .limit(1);

    const existingLead = existingLeads?.[0];

    // If lead exists, update it instead of creating new
    if (existingLead) {
      const { data: updatedLead, error: updateError } = await supabase
        .from('enrollment_leads')
        .update({
          email,
          full_name: fullName || '',
          mobile_no: mobileNo,
          alternate_mobile_no: alternateMobileNo || null,
          course_title: courseTitle,
          tier_title: tierTitle,
          duration_months: durationMonths,
          duration_hours: durationHours,
          course_mode: courseMode,
          total_amount: totalAmount,
        })
        .eq('id', existingLead.id)
        .select('id')
        .single();

      if (updateError) {
        console.error('Error updating lead:', updateError);
        return NextResponse.json(
          { success: false, error: 'Failed to update enrollment data' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        leadId: updatedLead.id,
        message: 'Enrollment data updated',
      });
    }

    // Create new lead
    const { data: lead, error: insertError } = await supabase
      .from('enrollment_leads')
      .insert({
        user_id: user.id,
        email,
        full_name: fullName || '',
        mobile_no: mobileNo,
        alternate_mobile_no: alternateMobileNo || null,
        course_id: courseId,
        course_title: courseTitle,
        tier_id: tierId,
        tier_title: tierTitle,
        duration_months: durationMonths,
        duration_hours: durationHours,
        course_mode: courseMode,
        total_amount: totalAmount,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Error creating lead:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to save enrollment data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Enrollment data saved',
    });
  } catch (error: any) {
    console.error('Error in save-lead:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save enrollment data' },
      { status: 500 }
    );
  }
}
