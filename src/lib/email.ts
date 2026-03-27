import nodemailer from "nodemailer";

// Initialize email transporter
const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn("Email service not configured. Check SMTP env variables.");
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  from?: string
) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.warn("Email transporter not configured");
      return false;
    }

    const result = await transporter.sendMail({
      from: from || process.env.EMAIL_FROM || "noreply@bijouterie-nador.com",
      to,
      subject,
      html,
    });

    console.log("Email sent:", result.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
  locale: string = "fr"
) => {
  const itemsHtml = items
    .map(
      (item) =>
        `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">x${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)} MAD</td>
    </tr>
    `
    )
    .join("");

  const subject =
    locale === "fr"
      ? `Confirmation de commande #${orderNumber}`
      : `Order Confirmation #${orderNumber}`;

  const content =
    locale === "fr"
      ? `
  <h2>Merci pour votre commande !</h2>
  <p>Bonjour ${customerName},</p>
  <p>Votre commande a été reçue avec succès. Voici les détails :</p>
  <p><strong>Numéro de commande :</strong> ${orderNumber}</p>
  <table style="width: 100%; margin: 20px 0;">
    <thead style="background: #f5f5f5;">
      <tr>
        <th style="padding: 12px; text-align: left;">Article</th>
        <th style="padding: 12px; text-align: right;">Quantité</th>
        <th style="padding: 12px; text-align: right;">Prix</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>
  <p style="font-size: 18px; font-weight: bold;">Total : ${total.toFixed(2)} MAD</p>
  <p>Nous vous remercions de votre achat ! Nous vous tiendrons informé de l'état de votre commande.</p>
  <p>Cordialement,<br>L'équipe Bijouterie Nador</p>
  `
      : `
  <h2>Thank you for your order!</h2>
  <p>Hello ${customerName},</p>
  <p>Your order has been received successfully. Here are the details:</p>
  <p><strong>Order Number:</strong> ${orderNumber}</p>
  <table style="width: 100%; margin: 20px 0;">
    <thead style="background: #f5f5f5;">
      <tr>
        <th style="padding: 12px; text-align: left;">Item</th>
        <th style="padding: 12px; text-align: right;">Quantity</th>
        <th style="padding: 12px; text-align: right;">Price</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>
  <p style="font-size: 18px; font-weight: bold;">Total: ${total.toFixed(2)} MAD</p>
  <p>Thank you for your purchase! We will keep you informed about your order status.</p>
  <p>Best regards,<br>Bijouterie Nador Team</p>
  `;

  const html = `
  <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="border-bottom: 2px solid #e91e63; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #e91e63; margin: 0;">Bijouterie Nador</h1>
        </div>
        ${content}
        <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999;">
          <p>${locale === "fr" ? "Cet email a été envoyé automatiquement." : "This email was sent automatically."}</p>
        </div>
      </div>
    </body>
  </html>
  `;

  return sendEmail(customerEmail, subject, html);
};

/**
 * Send contact form confirmation email
 */
export const sendContactConfirmationEmail = async (
  customerEmail: string,
  customerName: string,
  subject: string,
  locale: string = "fr"
) => {
  const emailSubject =
    locale === "fr"
      ? "Nous avons reçu votre message"
      : "We received your message";

  const content =
    locale === "fr"
      ? `
  <h2>Merci pour votre message !</h2>
  <p>Bonjour ${customerName},</p>
  <p>Nous avons bien reçu votre message concernant "${subject}". Notre équipe vous répondra dans les plus brefs délais.</p>
  <p>Cordialement,<br>L'équipe Bijouterie Nador</p>
  `
      : `
  <h2>Thank you for your message!</h2>
  <p>Hello ${customerName},</p>
  <p>We have received your message about "${subject}". Our team will get back to you as soon as possible.</p>
  <p>Best regards,<br>Bijouterie Nador Team</p>
  `;

  const html = `
  <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="border-bottom: 2px solid #e91e63; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #e91e63; margin: 0;">Bijouterie Nador</h1>
        </div>
        ${content}
      </div>
    </body>
  </html>
  `;

  return sendEmail(customerEmail, emailSubject, html);
};

/**
 * Send newsletter subscription confirmation
 */
export const sendNewsletterConfirmationEmail = async (
  customerEmail: string,
  locale: string = "fr"
) => {
  const subject =
    locale === "fr"
      ? "Bienvenue à la Bijouterie Nador"
      : "Welcome to Bijouterie Nador";

  const content =
    locale === "fr"
      ? `
  <h2>Bienvenue dans notre newsletter !</h2>
  <p>Merci de vous être abonné à la Bijouterie Nador. Vous recevrez nos dernières collections, offres spéciales et conseils en joaillerie.</p>
  <p>Cordialement,<br>L'équipe Bijouterie Nador</p>
  `
      : `
  <h2>Welcome to our newsletter!</h2>
  <p>Thank you for subscribing to Bijouterie Nador. You will receive updates about our latest collections, special offers, and jewelry advice.</p>
  <p>Best regards,<br>Bijouterie Nador Team</p>
  `;

  const html = `
  <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="border-bottom: 2px solid #e91e63; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #e91e63; margin: 0;">Bijouterie Nador</h1>
        </div>
        ${content}
      </div>
    </body>
  </html>
  `;

  return sendEmail(customerEmail, subject, html);
};

/**
 * Send admin notification email
 */
export const sendAdminNotificationEmail = async (
  subject: string,
  content: string
) => {
  const adminEmail = process.env.SMTP_USER;
  if (!adminEmail) return false;

  const html = `
  <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>${subject}</h2>
        ${content}
      </div>
    </body>
  </html>
  `;

  return sendEmail(adminEmail, `[Admin] ${subject}`, html);
};
