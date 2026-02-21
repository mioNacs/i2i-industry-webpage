import { Resend } from 'resend';
import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

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

// Format number with Indian locale for PDF (without currency symbol, we prepend ₹ manually)
function formatNum(n: number): string {
  return n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

/**
 * Generate a Bill-of-Supply style PDF invoice matching the profile receipt modal.
 * Uses jsPDF which works server-side in Node.js without a browser.
 */
function generateInvoicePDF(data: EnrollmentEmailData): Buffer {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageW = pdf.internal.pageSize.getWidth(); // 210mm
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = margin;

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
  const invNo = `INV-${data.razorpayPaymentId?.substring(4).toUpperCase() || Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const basePrice = data.totalAmount / 1.18;
  const gstAmount = data.totalAmount - basePrice;

  // ─── Helper functions ───
  const drawLine = (x1: number, y1: number, x2: number, lineWidth = 0.3) => {
    pdf.setLineWidth(lineWidth);
    pdf.line(x1, y1, x2, y1);
  };

  const drawRect = (x: number, ry: number, w: number, h: number) => {
    pdf.setLineWidth(0.3);
    pdf.rect(x, ry, w, h);
  };

  // ─── BILL OF SUPPLY tag ───
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text('BILL OF SUPPLY', margin, y);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setDrawColor(150);
  const tagText = 'ORIGINAL FOR RECIPIENT';
  const tagW = pdf.getTextWidth(tagText) + 6;
  pdf.rect(margin + 40, y - 3.5, tagW, 5, 'S');
  pdf.text(tagText, margin + 43, y);
  y += 8;

  // ─── Outer border starts ───
  const borderStartY = y;

  // ─── Header Section: Logo (left 25%) + Company info (right 75%) ───
  const headerH = 28;
  const logoColW = contentW * 0.25;
  const infoColW = contentW * 0.75;

  // Try to embed logo from public directory
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    const logoData = fs.readFileSync(logoPath);
    const logoBase64 = logoData.toString('base64');
    // Fit logo inside the left column, vertically centered
    const logoMaxW = logoColW - 6;
    const logoMaxH = headerH - 8;
    pdf.addImage(`data:image/png;base64,${logoBase64}`, 'PNG', margin + 3, y + 4, logoMaxW, logoMaxH, undefined, 'FAST');
  } catch (e) {
    // Logo not found - just leave space empty
    console.warn('Logo not found for PDF:', e);
  }

  
  // Company name (bold, large)
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(15);
  const infoStartX = margin + logoColW + infoColW / 2;
  pdf.text('i2i Industry Private Limited', infoStartX, y + 10, { align: 'center' });

  // Contact info below
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.text('Mobile:', infoStartX - 38, y + 17);
  pdf.setFont('helvetica', 'normal');
  pdf.text('+91 9771618635', infoStartX - 28, y + 17);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Email:', infoStartX - 2, y + 17);
  pdf.setFont('helvetica', 'normal');
  pdf.text('info@i2iindustry.com', infoStartX + 7, y + 17);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Website:', infoStartX - 16, y + 22);
  pdf.setFont('helvetica', 'normal');
  pdf.text('www.i2iindustry.com', infoStartX - 4, y + 22);

  y += headerH;
  drawLine(margin, y, pageW - margin, 0.3);
  y += 2;

  // ─── Bill To / Invoice Details ───
  const billToColW = contentW / 2;

  // Bill To (left)
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('BILL TO', margin + 4, y + 6);
  pdf.setFontSize(12);
  const customerName = (data.userName || data.userEmail.split('@')[0]).toUpperCase();
  pdf.text(customerName, margin + 4, y + 13);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(`Mobile: ${data.mobileNo || 'N/A'}`, margin + 4, y + 19);
  pdf.text(`Email: ${data.userEmail}`, margin + 4, y + 24);

  // Vertical separator
  const midX = margin + billToColW;
  drawLine(midX, y, midX, y); // just a point, we draw vertical below
  pdf.setLineWidth(0.3);
  pdf.line(midX, y, midX, y + 28);

  // Invoice Info (right)
  const rightCol = midX + 5;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('Invoice No.', rightCol, y + 8);
  pdf.setFont('helvetica', 'normal');
  pdf.text(invNo, rightCol, y + 14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Date', rightCol + 55, y + 8);
  pdf.setFont('helvetica', 'normal');
  pdf.text(dateStr, rightCol + 55, y + 14);

  y += 30;
  drawLine(margin, y, pageW - margin, 0.3);

  // ─── Items Table ───
  const col1W = contentW * 0.1;
  const col2W = contentW * 0.6;
  const col3W = contentW * 0.3;

  // Table header
  y += 1;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  const tableHeaderH = 10;
  pdf.text('S.NO.', margin + col1W / 2, y + 7, { align: 'center' });
  pdf.text('ITEM DETAILS', margin + col1W + 4, y + 7);
  pdf.text('AMOUNT', margin + col1W + col2W + col3W / 2, y + 7, { align: 'center' });

  // Vertical lines for header
  pdf.line(margin + col1W, y, margin + col1W, y + tableHeaderH);
  pdf.line(margin + col1W + col2W, y, margin + col1W + col2W, y + tableHeaderH);

  y += tableHeaderH;
  drawLine(margin, y, pageW - margin, 0.3);

  // Table row
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  const rowStartY = y;
  pdf.text('1', margin + col1W / 2, y + 8, { align: 'center' });

  // Item details
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.courseTitle || 'Course', margin + col1W + 4, y + 8);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  if (data.tierTitle) {
    pdf.text(`Tier: ${data.tierTitle}`, margin + col1W + 4, y + 14);
  }
  if (data.courseMode) {
    pdf.text(`Mode: ${data.courseMode}`, margin + col1W + 4, y + 20);
  }
  if (data.durationMonths) {
    pdf.text(`Duration: ${data.durationMonths} months`, margin + col1W + 4, y + 26);
  }

  // Amount
  pdf.setFontSize(10);
  pdf.text(`Rs. ${formatNum(basePrice)}`, margin + col1W + col2W + col3W - 4, y + 8, { align: 'right' });

  // Row height (item row + empty space)
  const itemRowH = 55;
  // Vertical lines for item row
  pdf.line(margin + col1W, rowStartY, margin + col1W, rowStartY + itemRowH);
  pdf.line(margin + col1W + col2W, rowStartY, margin + col1W + col2W, rowStartY + itemRowH);

  y = rowStartY + itemRowH;
  drawLine(margin, y, pageW - margin, 0.3);

  // ─── Footer rows: Base Price, GST, Total ───
  const footerRowH = 10;

  // Base Price
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('BASE PRICE', margin + col1W + col2W - 4, y + 7, { align: 'right' });
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Rs. ${formatNum(basePrice)}`, margin + contentW - 4, y + 7, { align: 'right' });
  pdf.line(margin + col1W + col2W, y, margin + col1W + col2W, y + footerRowH);
  y += footerRowH;
  drawLine(margin, y, pageW - margin, 0.3);

  // GST (18%)
  pdf.setFont('helvetica', 'bold');
  pdf.text('GST (18%)', margin + col1W + col2W - 4, y + 7, { align: 'right' });
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Rs. ${formatNum(gstAmount)}`, margin + contentW - 4, y + 7, { align: 'right' });
  pdf.line(margin + col1W + col2W, y, margin + col1W + col2W, y + footerRowH);
  y += footerRowH;
  drawLine(margin, y, pageW - margin, 0.3);

  // Total Amount (highlighted)
  pdf.setFillColor(249, 250, 251);
  pdf.rect(margin, y, contentW, footerRowH, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text('TOTAL AMOUNT', margin + col1W + col2W - 4, y + 7, { align: 'right' });
  pdf.text(`Rs. ${formatNum(data.totalAmount)}`, margin + contentW - 4, y + 7, { align: 'right' });
  pdf.line(margin + col1W + col2W, y, margin + col1W + col2W, y + footerRowH);
  y += footerRowH;
  drawLine(margin, y, pageW - margin, 0.3);

  // ─── Received / Balance ───
  y += 2;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Received Amount: Rs. ${formatNum(data.amountPaid)}`, margin + 4, y + 6);
  pdf.text(`Balance Amount: Rs. ${formatNum(data.remainingAmount)}`, midX + 5, y + 6);
  y += 12;
  drawLine(margin, y, pageW - margin, 0.3);

  // ─── Terms and Conditions ───
  y += 4;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('Terms and Conditions', margin + 4, y + 4);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  const termsText = [
    'This invoice covers the upfront payment for the selected training and placement program.',
    'The remaining fees must be paid as agreed upon or before course completion.',
    'Upfront payments are non-refundable; other payments are refundable if requested within',
    '15 days of the course start, per the refund policy.',
    'Program changes need approval and may incur extra charges.',
  ];
  y += 8;
  termsText.forEach(line => {
    pdf.text(line, margin + 4, y + 4);
    y += 4;
  });
  y += 4;

  // ─── Draw outer border around the invoice body ───
  drawRect(margin, borderStartY, contentW, y - borderStartY);

  // Output as Buffer
  const arrayBuffer = pdf.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}

function generateEmailHtml(data: EnrollmentEmailData): string {
  const statusColor = data.paymentStatus === 'success' ? '#16a34a' : '#ef4444';
  const statusText = data.paymentStatus === 'success' ? 'Payment Successful' : 'Payment Failed';
  const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit'
  });
  const invNo = `INV-${data.razorpayPaymentId?.substring(4).toUpperCase() || Math.random().toString(36).substring(2,8).toUpperCase()}`;

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
              <p style="margin: 0; font-size: 12px; color: #4b5563;">info@i2iindustry.com</p>
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

    // Generate invoice PDF attachment (only for successful payments)
    const attachments: { filename: string; content: Buffer }[] = [];
    if (data.paymentStatus === 'success') {
      try {
        const pdfBuffer = generateInvoicePDF(data);
        const invNo = `INV-${data.razorpayPaymentId?.substring(4).toUpperCase() || 'RECEIPT'}`;
        attachments.push({
          filename: `Receipt_${invNo}.pdf`,
          content: pdfBuffer,
        });
        console.log('Invoice PDF generated successfully, size:', pdfBuffer.length, 'bytes');
      } catch (pdfErr) {
        console.error('Failed to generate invoice PDF (email will still send):', pdfErr);
      }
    }

    const { error } = await resend.emails.send({
      from: 'i2i Industry <no-reply@support.i2iindustry.com>',
      to: [data.userEmail, SUPPORT_EMAIL],
      subject,
      html: generateEmailHtml(data),
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('Enrollment email sent successfully to', SUPPORT_EMAIL, attachments.length > 0 ? '(with PDF attachment)' : '');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to send enrollment email:', error);
    return { success: false, error: error.message };
  }
}
