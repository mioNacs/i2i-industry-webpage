import { Resend } from 'resend';

const SUPPORT_EMAIL = 'support@i2iindustry.com';

// Initialize Resend - will be undefined if API key not set
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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
  const statusColor = data.paymentStatus === 'success' ? '#22c55e' : '#ef4444';
  const statusText = data.paymentStatus === 'success' ? 'Payment Successful' : 'Payment Failed';
  const paymentTypeLabel = data.paymentType === 'full' ? 'Full Payment' : 'Partial Payment (Book Slot)';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enrollment Notification - ${statusText}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 30px; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                📚 Course Enrollment Notification
              </h1>
              <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </td>
          </tr>

          <!-- Status Badge -->
          <tr>
            <td style="padding: 30px 30px 0;">
              <div style="background-color: ${statusColor}15; border: 1px solid ${statusColor}40; border-radius: 8px; padding: 15px; text-align: center;">
                <span style="color: ${statusColor}; font-weight: 600; font-size: 18px;">
                  ${data.paymentStatus === 'success' ? '✅' : '❌'} ${statusText}
                </span>
                <p style="margin: 5px 0 0; color: #64748b; font-size: 14px;">
                  ${paymentTypeLabel}
                </p>
              </div>
            </td>
          </tr>

          <!-- User Information -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 20px; color: #1e293b; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                👤 User Details
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; width: 40%;">Name:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">${data.userName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Email:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">
                    <a href="mailto:${data.userEmail}" style="color: #6366f1; text-decoration: none;">${data.userEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Mobile:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">
                    <a href="tel:${data.mobileNo}" style="color: #6366f1; text-decoration: none;">${data.mobileNo}</a>
                  </td>
                </tr>
                ${data.alternateMobileNo ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Alternate Mobile:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">
                    <a href="tel:${data.alternateMobileNo}" style="color: #6366f1; text-decoration: none;">${data.alternateMobileNo}</a>
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

          <!-- Course Information -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; color: #1e293b; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                📖 Course Details
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; width: 40%;">Course:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">${data.courseTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Tier:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">${data.tierTitle}</td>
                </tr>
                ${data.durationMonths ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Duration:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">${data.durationMonths}${data.durationHours ? ` (${data.durationHours} Hours)` : ''}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Mode:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">${data.courseMode}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment Information -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; color: #1e293b; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                💳 Payment Details
              </h2>
              <table style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 8px;">
                <tr>
                  <td style="padding: 12px 15px; color: #64748b;">Payment Type:</td>
                  <td style="padding: 12px 15px; color: #1e293b; font-weight: 600;">${paymentTypeLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; color: #64748b;">Amount Paid:</td>
                  <td style="padding: 12px 15px; color: ${statusColor}; font-weight: 700; font-size: 18px;">${formatCurrency(data.amountPaid)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; color: #64748b;">Total Course Fee:</td>
                  <td style="padding: 12px 15px; color: #1e293b; font-weight: 500;">${formatCurrency(data.totalAmount)}</td>
                </tr>
                ${data.remainingAmount > 0 ? `
                <tr>
                  <td style="padding: 12px 15px; color: #64748b;">Remaining Amount:</td>
                  <td style="padding: 12px 15px; color: #f59e0b; font-weight: 600;">${formatCurrency(data.remainingAmount)}</td>
                </tr>
                ` : ''}
                ${data.razorpayPaymentId ? `
                <tr>
                  <td style="padding: 12px 15px; color: #64748b;">Payment ID:</td>
                  <td style="padding: 12px 15px; color: #1e293b; font-family: monospace; font-size: 12px;">${data.razorpayPaymentId}</td>
                </tr>
                ` : ''}
                ${data.razorpayOrderId ? `
                <tr>
                  <td style="padding: 12px 15px; color: #64748b;">Order ID:</td>
                  <td style="padding: 12px 15px; color: #1e293b; font-family: monospace; font-size: 12px;">${data.razorpayOrderId}</td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

          ${data.paymentStatus === 'failed' && data.errorReason ? `
          <!-- Error Details -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px;">
                <h3 style="margin: 0 0 10px; color: #dc2626; font-size: 14px;">⚠️ Error Reason:</h3>
                <p style="margin: 0; color: #7f1d1d; font-size: 13px;">${data.errorReason}</p>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 12px; text-align: center;">
                This is an automated notification from i2i Industry enrollment system.<br>
                Please do not reply to this email.
              </p>
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
  if (!resend) {
    console.warn('Resend API key not configured. Email not sent.');
    console.log('Enrollment data:', JSON.stringify(data, null, 2));
    return { success: true, error: 'Email service not configured' };
  }

  try {
    const subject = `[${data.paymentStatus.toUpperCase()}] Course Enrollment - ${data.courseTitle} - ${data.userName || data.userEmail}`;

    const { error } = await resend.emails.send({
      from: 'i2i Industry <notifications@i2iindustry.com>',
      to: [SUPPORT_EMAIL],
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
