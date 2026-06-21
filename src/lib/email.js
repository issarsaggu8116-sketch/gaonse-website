import nodemailer from "nodemailer";

/**
 * Creates and returns a Nodemailer transporter based on .env variables.
 */
export function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port) || 587,
    secure: Number(port) === 465,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Sends a One-Time Password (OTP) verification email.
 */
export async function sendOTPEmail(email, otp) {
  const from = process.env.SMTP_FROM || "GaonSe <no-reply@gaonse.com>";
  const transporter = getTransporter();

  const htmlContent = `
    <div style="font-family: 'Playfair Display', Georgia, serif; color: #2C2520; background-color: #FDFBF7; padding: 40px 30px; border-radius: 16px; border: 1px solid #7A4E2D; max-width: 500px; margin: auto; box-shadow: 0 4px 12px rgba(122,78,45,0.08);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #7A4E2D; font-size: 26px; margin: 0; font-weight: bold; letter-spacing: 1px;">GaonSe</h2>
        <p style="color: #D6A15F; font-size: 11px; margin: 5px 0 0 0; text-transform: uppercase; tracking-wider: 1px;">Authentic Village Harvests</p>
      </div>
      <p style="font-size: 14px; line-height: 1.5; color: #5C5043; font-family: sans-serif;">Dear Customer,</p>
      <p style="font-size: 14px; line-height: 1.5; color: #5C5043; font-family: sans-serif;">Thank you for logging in to GaonSe. Use the following 6-digit One-Time Password (OTP) to complete your verification. This code is valid for 5 minutes:</p>
      <div style="background-color: #F5EFEB; text-align: center; padding: 18px; font-size: 34px; font-weight: bold; letter-spacing: 6px; color: #7A4E2D; border-radius: 12px; margin: 30px 0; border: 1px solid #E5DFD9; font-family: monospace;">
        ${otp}
      </div>
      <p style="font-size: 12px; color: #8C7A6B; line-height: 1.5; text-align: center; margin: 25px 0 15px 0; font-family: sans-serif;">If you did not request this OTP, you can safely ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #E5DFD9; margin: 25px 0;">
      <p style="font-size: 10px; text-align: center; color: #8C7A6B; margin: 0; font-family: sans-serif;">GaonSe.com - Bringing India's Villages Closer To You</p>
    </div>
  `;

  if (!transporter) {
    console.warn(`[GaonSe Email Error] SMTP is not configured. Failed to send OTP email to ${email}`);
    return { success: false, error: "SMTP is not configured. Please setup your mail environment variables." };
  }

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: "GaonSe - Your One-Time Password (OTP) for Login",
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.warn(`[GaonSe Email Error] Failed to send OTP email to ${email}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Sends a beautifully styled tax invoice/receipt email to the customer.
 */
export async function sendOrderReceiptEmail(order) {
  const from = process.env.SMTP_FROM || "GaonSe <no-reply@gaonse.com>";
  const to = order.shippingDetails.email;
  const transporter = getTransporter();

  // GST Breakdown calculations
  const gst = order.gst || 0;
  const isUP = order.shippingDetails.state === "Uttar Pradesh";
  const cgst = Math.round(gst / 2);
  const sgst = gst - cgst;

  // Item rows compiler
  const itemRowsHtml = order.cart.map(item => `
    <tr style="border-bottom: 1px solid #E5DFD9;">
      <td style="padding: 12px 8px; text-align: left;">
        <div style="font-weight: bold; color: #7A4E2D;">${item.product.name}</div>
        <div style="font-size: 11px; color: #8C7A6B;">Weight: ${item.selectedWeight.weight}</div>
      </td>
      <td style="padding: 12px 8px; text-align: center; color: #5C5043;">${item.quantity}</td>
      <td style="padding: 12px 8px; text-align: right; color: #5C5043;">₹${item.selectedWeight.price}</td>
      <td style="padding: 12px 8px; text-align: right; font-weight: bold; color: #2C2520;">₹${item.selectedWeight.price * item.quantity}</td>
    </tr>
  `).join("");

  const taxRowsHtml = isUP ? `
    <tr>
      <td colspan="3" style="padding: 4px 8px; text-align: right; color: #8C7A6B; font-size: 11px;">CGST (2.5%):</td>
      <td style="padding: 4px 8px; text-align: right; color: #8C7A6B; font-size: 11px;">₹${cgst}</td>
    </tr>
    <tr>
      <td colspan="3" style="padding: 4px 8px; text-align: right; color: #8C7A6B; font-size: 11px;">SGST (2.5%):</td>
      <td style="padding: 4px 8px; text-align: right; color: #8C7A6B; font-size: 11px;">₹${sgst}</td>
    </tr>
  ` : `
    <tr>
      <td colspan="3" style="padding: 4px 8px; text-align: right; color: #8C7A6B; font-size: 11px;">IGST (5.0%):</td>
      <td style="padding: 4px 8px; text-align: right; color: #8C7A6B; font-size: 11px;">₹${gst}</td>
    </tr>
  `;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #2C2520; background-color: #FDFBF7; padding: 30px 20px; max-width: 600px; margin: auto; border: 1px solid #E5DFD9; border-radius: 12px;">
      
      <!-- Brand Logo / Header -->
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #7A4E2D; margin-bottom: 20px;">
        <h1 style="font-family: 'Playfair Display', Georgia, serif; color: #7A4E2D; margin: 0; font-size: 28px; letter-spacing: 1px;">GaonSe</h1>
        <p style="color: #D6A15F; font-size: 12px; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">Authentic Village Harvests</p>
      </div>

      <!-- Introduction -->
      <div style="margin-bottom: 25px;">
        <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #7A4E2D; font-size: 20px; margin-top: 0;">Order Confirmed!</h2>
        <p style="font-size: 14px; line-height: 1.5; color: #5C5043;">
          Namaste <strong>${order.shippingDetails.name}</strong>,<br>
          Thank you for choosing local, farmer-direct harvests. Your payment has been authorized and your order is being processed for consolidation.
        </p>
        <div style="margin: 20px 0; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track-order?id=${order.id}" style="background-color: #7A4E2D; color: #FDFBF7; padding: 12px 24px; text-decoration: none; border-radius: 24px; font-size: 12px; font-weight: bold; display: inline-block; font-family: sans-serif; box-shadow: 0 2px 4px rgba(122,78,45,0.15);">
            Track Your Order Live
          </a>
        </div>
      </div>

      <!-- Order Details / Summary Box -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px;">
        <tr style="background-color: #F5EFEB;">
          <th style="padding: 10px; text-align: left; color: #7A4E2D;">Order ID</th>
          <th style="padding: 10px; text-align: right; color: #7A4E2D;">Purchase Date</th>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; font-family: monospace; font-size: 14px; color: #2C2520;">${order.id}</td>
          <td style="padding: 10px; text-align: right; color: #5C5043;">${order.date}</td>
        </tr>
      </table>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 25px;">
        <thead>
          <tr style="border-bottom: 2px solid #E5DFD9; background-color: #FDFBF7;">
            <th style="padding: 8px; text-align: left; color: #7A4E2D;">Product Sourced</th>
            <th style="padding: 8px; text-align: center; color: #7A4E2D; width: 60px;">Qty</th>
            <th style="padding: 8px; text-align: right; color: #7A4E2D; width: 80px;">Rate</th>
            <th style="padding: 8px; text-align: right; color: #7A4E2D; width: 90px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRowsHtml}
          
          <!-- Calculations -->
          <tr>
            <td colspan="3" style="padding: 12px 8px 4px 8px; text-align: right; color: #5C5043; font-weight: bold;">Subtotal:</td>
            <td style="padding: 12px 8px 4px 8px; text-align: right; color: #5C5043; font-weight: bold;">₹${order.subtotal}</td>
          </tr>
          
          ${order.discount > 0 ? `
          <tr>
            <td colspan="3" style="padding: 4px 8px; text-align: right; color: #2E7D32; font-weight: bold;">Discount Applied:</td>
            <td style="padding: 4px 8px; text-align: right; color: #2E7D32; font-weight: bold;">-₹${order.discount}</td>
          </tr>
          ` : ""}
          
          <tr>
            <td colspan="3" style="padding: 4px 8px; text-align: right; color: #5C5043;">Delivery Fee:</td>
            <td style="padding: 4px 8px; text-align: right; color: #5C5043;">${order.delivery === 0 ? "FREE" : `₹${order.delivery}`}</td>
          </tr>
          
          ${taxRowsHtml}
          
          <tr style="border-top: 2px solid #7A4E2D; font-size: 15px; font-weight: bold;">
            <td colspan="3" style="padding: 12px 8px; text-align: right; color: #7A4E2D;">Grand Total (Net):</td>
            <td style="padding: 12px 8px; text-align: right; color: #7A4E2D; font-size: 16px;">₹${order.total}</td>
          </tr>
        </tbody>
      </table>

      <!-- Shipping Information Card -->
      <div style="background-color: #F5EFEB; border-radius: 8px; padding: 15px; font-size: 13px; border: 1px solid #E5DFD9; margin-bottom: 25px;">
        <h3 style="margin-top: 0; color: #7A4E2D; font-family: 'Playfair Display', Georgia, serif; font-size: 15px; border-bottom: 1px solid #E5DFD9; padding-bottom: 6px;">Delivery Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.4;">
          <tr>
            <td style="font-weight: bold; width: 100px; color: #8C7A6B;">Recipient:</td>
            <td style="color: #2C2520;">${order.shippingDetails.name}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #8C7A6B;">Phone:</td>
            <td style="color: #2C2520;">${order.shippingDetails.phone}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #8C7A6B; vertical-align: top;">Address:</td>
            <td style="color: #2C2520;">
              ${order.shippingDetails.address}<br>
              ${order.shippingDetails.city}, ${order.shippingDetails.state} - ${order.shippingDetails.zip}
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #8C7A6B;">Sourced From:</td>
            <td style="color: #2C2520;">Varanasi Consolidation Center, UP</td>
          </tr>
        </table>
      </div>

      <!-- Footer Slogan and Details -->
      <div style="text-align: center; border-top: 1px solid #E5DFD9; padding-top: 15px; font-size: 11px; color: #8C7A6B; line-height: 1.5;">
        <p style="margin: 0 0 5px 0;">This email serves as an official GST invoice for your order.</p>
        <p style="margin: 0; font-weight: bold; color: #7A4E2D;">GaonSe.com - Bringing India's Villages Closer To You</p>
      </div>

    </div>
  `;

  if (!transporter) {
    console.warn(`[GaonSe Email Error] SMTP is not configured. Failed to send order receipt to ${to}`);
    return { success: false, error: "SMTP is not configured." };
  }

  try {
    await transporter.sendMail({
      from,
      to,
      subject: `GaonSe Order Confirmed - Invoice #${order.id}`,
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.warn(`[GaonSe Email Error] Failed to send order receipt to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Sends a notification email to the customer when the order status changes.
 */
export async function sendOrderStatusUpdateEmail(order) {
  const from = process.env.SMTP_FROM || "GaonSe <no-reply@gaonse.com>";
  const to = order.shippingDetails.email;
  const transporter = getTransporter();

  let subject = `GaonSe Order Update - #${order.id}`;
  let title = "Order Status Update";
  let description = "";
  let logisticsBoxHtml = "";

  if (order.status === "Dispatched") {
    subject = `GaonSe Order Dispatched - #${order.id}`;
    title = "Your Harvest is on the Way!";
    description = `We are pleased to inform you that your order has been dispatched from our **Varanasi Consolidation Center, UP** and is currently in transit to your delivery address.`;
    logisticsBoxHtml = `
      <div style="background-color: #F5EFEB; border-radius: 8px; padding: 15px; font-size: 13px; border: 1px solid #E5DFD9; margin-bottom: 25px;">
        <h3 style="margin-top: 0; color: #7A4E2D; font-family: 'Playfair Display', Georgia, serif; font-size: 15px; border-bottom: 1px solid #E5DFD9; padding-bottom: 6px;">Logistics Tracking</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.5;">
          <tr>
            <td style="font-weight: bold; width: 120px; color: #8C7A6B;">Courier Partner:</td>
            <td style="color: #2C2520;">Delhivery Standard Air</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #8C7A6B;">Tracking ID:</td>
            <td style="color: #2C2520; font-family: monospace; font-size: 13px; font-weight: bold;">${order.trackingId || "In Progress"}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #8C7A6B;">Estimated Delivery:</td>
            <td style="color: #2C2520;">Within 3-5 Business Days</td>
          </tr>
        </table>
      </div>
    `;
  } else if (order.status === "Delivered") {
    subject = `GaonSe Order Delivered! - #${order.id}`;
    title = "Sourced Harvest Delivered Successfully!";
    description = `Namaste! Your order **#${order.id}** containing pure, handcrafted village harvests has been marked as **Delivered**. We hope these authentic tastes bring joy and wellness to your home.`;
    logisticsBoxHtml = `
      <div style="background-color: #E2F0D9; border-radius: 8px; padding: 15px; font-size: 13px; border: 1px solid #C5E0B4; margin-bottom: 25px; text-align: center; color: #385723;">
        <strong>✓ Package Handed Over Successfully</strong>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #548235;">Delivered to: ${order.shippingDetails.address}, ${order.shippingDetails.city}</p>
      </div>
    `;
  } else {
    description = `Your order status has been updated to **${order.status}**.`;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #2C2520; background-color: #FDFBF7; padding: 30px 20px; max-width: 600px; margin: auto; border: 1px solid #E5DFD9; border-radius: 12px;">
      
      <!-- Brand Logo / Header -->
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #7A4E2D; margin-bottom: 20px;">
        <h1 style="font-family: 'Playfair Display', Georgia, serif; color: #7A4E2D; margin: 0; font-size: 28px; letter-spacing: 1px;">GaonSe</h1>
        <p style="color: #D6A15F; font-size: 12px; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">Authentic Village Harvests</p>
      </div>

      <!-- Main Info -->
      <div style="margin-bottom: 25px;">
        <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #7A4E2D; font-size: 20px; margin-top: 0;">${title}</h2>
        <p style="font-size: 14px; line-height: 1.5; color: #5C5043;">
          Dear <strong>${order.shippingDetails.name}</strong>,<br><br>
          ${description}
        </p>
        <div style="margin: 20px 0; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track-order?id=${order.id}" style="background-color: #7A4E2D; color: #FDFBF7; padding: 12px 24px; text-decoration: none; border-radius: 24px; font-size: 12px; font-weight: bold; display: inline-block; font-family: sans-serif; box-shadow: 0 2px 4px rgba(122,78,45,0.15);">
            Track Your Order Live Status
          </a>
        </div>
      </div>

      <!-- Logistics / Status Card -->
      ${logisticsBoxHtml}

      <!-- Order Reference Details -->
      <div style="background-color: #FDFBF7; border-radius: 8px; padding: 15px; font-size: 13px; border: 1px solid #E5DFD9; margin-bottom: 25px;">
        <h3 style="margin-top: 0; color: #7A4E2D; font-family: 'Playfair Display', Georgia, serif; font-size: 14px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr>
            <td style="font-weight: bold; width: 100px; color: #8C7A6B;">Order ID:</td>
            <td style="color: #2C2520; font-family: monospace;">${order.id}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #8C7A6B;">Items Count:</td>
            <td style="color: #2C2520;">${order.cart.length} items</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #8C7A6B;">Grand Total:</td>
            <td style="color: #2C2520; font-weight: bold;">₹${order.total}</td>
          </tr>
        </table>
      </div>

      <!-- Footer Slogan and Details -->
      <div style="text-align: center; border-top: 1px solid #E5DFD9; padding-top: 15px; font-size: 11px; color: #8C7A6B; line-height: 1.5;">
        <p style="margin: 0 0 5px 0;">You can track your order live anytime on our website using your Order ID.</p>
        <p style="margin: 0; font-weight: bold; color: #7A4E2D;">GaonSe.com - Bringing India's Villages Closer To You</p>
      </div>

    </div>
  `;

  if (!transporter) {
    console.warn(`[GaonSe Email Error] SMTP is not configured. Failed to send order status update to ${to}`);
    return { success: false, error: "SMTP is not configured." };
  }

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.warn(`[GaonSe Email Error] Failed to send order status update to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}
