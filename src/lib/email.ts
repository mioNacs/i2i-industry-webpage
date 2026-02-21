import { Resend } from 'resend';

const SUPPORT_EMAIL = 'support@i2iindustry.com';

// We initialize Resend dynamically inside the function to pick up env vars without a hard restart

export interface EnrollmentEmailData {
  userEmail: string;
  userName: string;
  mobileNo: string;
  alternateMobileNo?: string;
  courseTitle: string;
  tierTitle: string;
  durationMonths?: string;
  durationHours?: number;
  courseMode: string;
  paymentType: 'full' | 'partial';
  amountPaid: number;
  totalAmount: number;
  remainingAmount: number;
  paymentStatus: 'success' | 'failed';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  errorReason?: string;
}

function formatCurrency(rupees: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

function generateEmailHtml(data: EnrollmentEmailData): string {
  const statusColor = data.paymentStatus === 'success' ? '#16a34a' : '#ef4444';
  const statusText = data.paymentStatus === 'success' ? 'Payment Successful' : 'Payment Failed';
  const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit'
  });
  const invNo = `INV-${data.razorpayPaymentId?.substring(4, 12).toUpperCase() || Math.random().toString(36).substring(2,8).toUpperCase()}`;

  // Make it look exactly like a paper receipt!
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - i2i Industry</title>
</head>
<body style="margin: 0; padding: 20px; font-family: monospace, 'Courier New', Courier; background-color: #f3f4f6; color: #1f2937;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center">
        <!-- Receipt Container -->
        <table role="presentation" style="width: 100%; max-width: 400px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-top: 4px dashed #e5e7eb; border-bottom: 4px dashed #e5e7eb;">
          
          <!-- Header Logo & Meta -->
          <tr>
            <td style="padding: 30px 20px 10px; text-align: center;">
              <h1 style="margin: 0 0 5px; font-size: 18px; font-weight: bold; font-family: sans-serif; letter-spacing: 1px;">i2i INDUSTRY PRIVATE LIMITED</h1>
              <p style="margin: 0; font-size: 12px; color: #4b5563;">support@i2iindustry.com</p>
              <p style="margin: 0; font-size: 12px; color: #4b5563;">+91 9771618635</p>
              <p style="margin: 0; font-size: 12px; color: #4b5563;">www.i2iindustry.com</p>
            </td>
          </tr>

          <!-- Dashed Line -->
          <tr>
            <td style="padding: 0 20px;">
              <div style="border-top: 1px dashed #9ca3af; margin: 15px 0;"></div>
            </td>
          </tr>

          <!-- Invoice Details -->
          <tr>
            <td style="padding: 0 20px; font-size: 13px;">
              <table style="width: 100%;">
                <tr>
                  <td style="text-align: left;">Receipt No:</td>
                  <td style="text-align: right; font-weight: bold;">${invNo}</td>
                </tr>
                <tr>
                  <td style="text-align: left;">Date:</td>
                  <td style="text-align: right; font-weight: bold;">${dateStr}</td>
                </tr>
                <tr>
                  <td style="text-align: left;">Status:</td>
                  <td style="text-align: right; font-weight: bold; color: ${statusColor};">${statusText}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dashed Line -->
          <tr>
            <td style="padding: 0 20px;">
              <div style="border-top: 1px dashed #9ca3af; margin: 15px 0;"></div>
            </td>
          </tr>

          <!-- User Details -->
          <tr>
            <td style="padding: 0 20px; font-size: 13px;">
              <h3 style="margin: 0 0 10px; font-size: 14px; text-decoration: underline;">BILLED TO</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="text-align: left; padding-bottom: 4px;">Name:</td>
                  <td style="text-align: right; font-weight: bold;">${data.userName || data.userEmail.split('@')[0]}</td>
                </tr>
                <tr>
                  <td style="text-align: left; padding-bottom: 4px;">Email:</td>
                  <td style="text-align: right; font-weight: bold;">${data.userEmail}</td>
                </tr>
                <tr>
                  <td style="text-align: left; padding-bottom: 4px;">Mobile:</td>
                  <td style="text-align: right; font-weight: bold;">${data.mobileNo || 'N/A'}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Solid Line -->
          <tr>
            <td style="padding: 0 20px;">
              <div style="border-top: 2px solid #374151; margin: 15px 0;"></div>
            </td>
          </tr>

          <!-- Item Details -->
          <tr>
            <td style="padding: 0 20px; font-size: 13px;">
              <table style="width: 100%;">
                <tr>
                  <td style="text-align: left; font-weight: bold; padding-bottom: 5px;">ITEM</td>
                  <td style="text-align: right; font-weight: bold; padding-bottom: 5px;">AMOUNT</td>
                </tr>
                <tr>
                  <td style="text-align: left; vertical-align: top;">
                    <strong>${data.courseTitle}</strong><br/>
                    Tier: ${data.tierTitle}<br/>
                    <small>(${data.paymentType === 'full' ? 'Full Payment' : 'Slot Booking'})</small>
                  </td>
                  <td style="text-align: right; vertical-align: top; font-weight: bold;">
                    ${formatCurrency(data.totalAmount)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Thick Solid Line -->
          <tr>
            <td style="padding: 0 20px;">
              <div style="border-top: 2px solid #374151; margin: 15px 0;"></div>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding: 0 20px; font-size: 13px;">
              <table style="width: 100%;">
                <tr>
                  <td style="text-align: left; padding: 4px 0;">Total Due</td>
                  <td style="text-align: right; padding: 4px 0;">${formatCurrency(data.totalAmount)}</td>
                </tr>
                <tr>
                  <td style="text-align: left; font-weight: bold; color: ${statusColor}; padding: 4px 0;">Received</td>
                  <td style="text-align: right; font-weight: bold; color: ${statusColor}; padding: 4px 0;">- ${formatCurrency(data.amountPaid)}</td>
                </tr>
                ${data.remainingAmount > 0 ? '<tr>' +
                  '<td style="text-align: left; font-weight: bold; color: #d97706; padding: 10px 0 4px; border-top: 1px solid #d1d5db;">Balance Pending</td>' +
                  '<td style="text-align: right; font-weight: bold; color: #d97706; padding: 10px 0 4px; border-top: 1px solid #d1d5db;">' + formatCurrency(data.remainingAmount) + '</td>' +
                '</tr>' : ''}
              </table>
            </td>
          </tr>

          <!-- Dashed Line -->
          <tr>
            <td style="padding: 0 20px;">
              <div style="border-top: 1px dashed #9ca3af; margin: 20px 0 15px;"></div>
            </td>
          </tr>

          <!-- Footer T&C -->
          <tr>
            <td style="padding: 0 20px 30px; text-align: center; font-size: 11px; color: #6b7280; line-height: 1.4;">
              <span style="font-weight: bold; font-size: 13px; color: #111827;">THANK YOU!</span><br/><br/>
              This is a system generated proof of payment.<br/>
              Subject to terms and conditions available at:<br/>
              <a href="https://i2iindustry.com/terms" style="color: #6b7280;">i2iindustry.com/terms</a><br/><br/>
              For queries, reach out to:<br/>
              <span style="font-weight: bold; color: #111827;">support@i2iindustry.com</span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
export async function sendEnrollmentEmail(data: EnrollmentEmailData): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.warn('Resend API key not configured. Email not sent.');
    console.log('Enrollment data:', JSON.stringify(data, null, 2));
    return { success: true, error: 'Email service not configured' };
  }

  const resend = new Resend(apiKey);

  try {
    const subject = `[${data.paymentStatus.toUpperCase()}] Course Enrollment - ${data.courseTitle} - ${data.userName || data.userEmail}`;

    const { error } = await resend.emails.send({
      from: 'i2i Industry <no-reply@support.i2iindustry.com>',
      to: [data.userEmail, SUPPORT_EMAIL],
      subject,
      html: generateEmailHtml(data),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('Enrollment email sent successfully to', SUPPORT_EMAIL);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to send enrollment email:', error);
    return { success: false, error: error.message };
  }
}
