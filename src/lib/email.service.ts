// src/lib/email.service.ts

interface SendEmailPayload {
  receiverName: string;
  receiverEmail: string;
  mailBody: string;
  subjectLine: string;
}

interface EmailApiResponse {
  success: boolean;
  message: string;
}

const EMAIL_CONFIG = {
  api_key: process.env.EMAIL_API_KEY || 'PZkmSGEXRFl8W4i76rsztHxb25jBQvIqYOhpdJf1',
  senderName: process.env.EMAIL_SENDER_NAME || 'V3Cars',
  senderEmail: process.env.EMAIL_SENDER_EMAIL || 'noreplyv3cars@gmail.com',
  senderId: process.env.EMAIL_SENDER_ID || 'v3cars',
  apiUrl: process.env.EMAIL_API_URL || 'http://emailapi.phoenixads.net/json/send-email.php',
};

// ─── Generic Send Email ───────────────────────────────────────────────────────

export const sendEmail = async (payload: SendEmailPayload): Promise<EmailApiResponse> => {
  try {
    const body = {
      api_key: EMAIL_CONFIG.api_key,
      senderName: EMAIL_CONFIG.senderName,
      senderEmail: EMAIL_CONFIG.senderEmail,
      senderId: EMAIL_CONFIG.senderId,
      receiverName: payload.receiverName,
      receiverEmail: payload.receiverEmail,
      mailBody: payload.mailBody,
      subjectLine: payload.subjectLine,
    };

    const response = await fetch(EMAIL_CONFIG.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(`[EmailService] HTTP error: ${response.status}`);
      return { success: false, message: 'Email API request failed' };
    }

    const data = await response.json();
    console.log('[EmailService] Response:', data);

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('[EmailService] Error sending email:', error);
    return { success: false, message: 'Failed to send email' };
  }
};

// ─── OTP Email Template ───────────────────────────────────────────────────────

export const sendOtpEmail = async (
  receiverName: string,
  receiverEmail: string,
  otp: string
): Promise<EmailApiResponse> => {
  return sendEmail({
    receiverName,
    receiverEmail,
    subjectLine: 'Your Login OTP - V3Cars',
    mailBody: `
Dear ${receiverName},

Your OTP for V3Cars Admin login is: ${otp}

This OTP is valid for 5 minutes. Do not share it with anyone.

Regards,
V3Cars Team
    `.trim(),
  });
};

export const sendPasswordResetEmail = async (
  receiverName: string,
  receiverEmail: string,
  otp: string
): Promise<EmailApiResponse> => {
  return sendEmail({
    receiverName,
    receiverEmail,
    subjectLine: 'Password Reset OTP - V3Cars',
    mailBody: `
Dear ${receiverName},

We received a request to reset your V3Cars Admin password.

Your OTP for password reset is: ${otp}

This OTP is valid for 5 minutes. If you did not request this, please ignore this email.

Regards,
V3Cars Team
    `.trim(),
  });
};