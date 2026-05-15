import prisma from '@/config/db';
import { logEvent } from '@/modules/admin/events/event.service';
import { LoginPayload, VerifyOtpPayload } from './auth.types';
import { sendOtpEmail, sendPasswordResetEmail } from '../../lib/email.service';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET    = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '8h';

const generateOtp = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

const hashPassword = (password: string): string =>
  crypto.createHash('md5').update(password).digest('hex');

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginService = async (payload: LoginPayload, ip?: string) => {
  const { adminEmailId, adminPassword } = payload;

  const admin = await prisma.tbladmins.findFirst({
    where: {
      adminEmailId,
      adminPassword: hashPassword(adminPassword),
    },
    select: {
      adminId:         true,
      adminName:       true,
      adminEmailId:    true,
      adminType:       true,
      adminSubType:    true,
      isLock:          true,
      accessStartDate: true,
      accessEndDate:   true,
      status:          true,
    },
  });

  if (!admin) {
    await logEvent({
      eventDescription: `Failed login attempt — email not found: ${adminEmailId}`,
      ipAddress:        ip,
    });
    return { success: false, message: 'not_exist' };
  }

  if (admin.isLock === 1) {
    await logEvent({
      eventDescription: `Login blocked — account locked: "${admin.adminName}"`,
      adminId:          admin.adminId,
      ipAddress:        ip,
    });
    return { success: false, message: 'Account Lock' };
  }

  const now       = new Date();
  const startDate = admin.accessStartDate ? new Date(admin.accessStartDate) : null;
  const endDate   = admin.accessEndDate   ? new Date(admin.accessEndDate)   : null;

  const isStatusActive = admin.status === 'Active';
  const isStartValid   = startDate ? startDate <= now : true;
  const isEndValid     = endDate   ? endDate   >= now : true;

  if (!isStatusActive || !isStartValid || !isEndValid) {
    await logEvent({
      eventDescription: `Login blocked — subscription expired: "${admin.adminName}"`,
      adminId:          admin.adminId,
      ipAddress:        ip,
    });
    return { success: false, message: 'sub_expired' };
  }

  const otp = generateOtp();
  console.log('Generated OTP:', otp);
  const otpGenerateDateTime = new Date();

  await prisma.tbladmins.update({
    where: { adminId: admin.adminId },
    data: {
      otp,
      otpGenerateDateTime,
      ...(ip && { lastLoginIPAddress: ip }),
    },
  });

  const emailResult = await sendOtpEmail(admin.adminName, admin.adminEmailId, otp);

  if (!emailResult.success) {
    console.error(`[Auth] Failed to send OTP email to ${admin.adminEmailId}`);
  }

  return {
    success: true,
    message: 'yes',
    ...(process.env.NODE_ENV === 'development' && { otp }),
  };
};

// ─── Verify OTP ───────────────────────────────────────────────────────────────

export const verifyOtpService = async (payload: VerifyOtpPayload, ip?: string) => {
  const { adminEmailId, otp } = payload;

  const admin = await prisma.tbladmins.findFirst({
    where: { adminEmailId, status: 'Active' },
    select: {
      adminId:             true,
      adminName:           true,
      adminEmailId:        true,
      adminType:           true,
      adminSubType:        true,
      otp:                 true,
      otpGenerateDateTime: true,
    },
  });

  if (!admin) {
    return { success: false, message: 'Admin not found' };
  }

  const OTP_EXPIRY_MS = 5 * 60 * 1000;
  const otpAge = Date.now() - new Date(admin.otpGenerateDateTime!).getTime();

  if (!admin.otp || otpAge > OTP_EXPIRY_MS) {
    await prisma.tbladmins.update({
      where: { adminId: admin.adminId },
      data: { otp: undefined, otpGenerateDateTime: undefined },
    });
    await logEvent({
      eventDescription: `OTP expired for: "${admin.adminName}"`,
      adminId:          admin.adminId,
      ipAddress:        ip,
    });
    return { success: false, message: 'OTP expired. Please login again.' };
  }

  if (admin.otp !== otp) {
    await logEvent({
      eventDescription: `Invalid OTP entered for: "${admin.adminName}"`,
      adminId:          admin.adminId,
      ipAddress:        ip,
    });
    return { success: false, message: 'Invalid OTP' };
  }

  await prisma.tbladmins.update({
    where: { adminId: admin.adminId },
    data: {
      otp:                 undefined,
      otpGenerateDateTime: undefined,
      lastLoginDateTime:   new Date(),
    },
  });

  const token = jwt.sign(
    {
      adminId:      admin.adminId,
      adminType:    admin.adminType,
      adminSubType: admin.adminSubType,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  await logEvent({
    eventDescription: `Admin "${admin.adminName}" logged in successfully`,
    adminId:          admin.adminId,
    ipAddress:        ip,
  });

  return {
    success: true,
    message: 'Login successful',
    token,
    data: {
      adminId:      admin.adminId,
      adminName:    admin.adminName,
      adminEmailId: admin.adminEmailId,
      adminType:    admin.adminType,
      adminSubType: admin.adminSubType,
    },
  };
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPasswordService = async (adminEmailId: string) => {
  const admin = await prisma.tbladmins.findFirst({
    where: { adminEmailId, status: 'Active' },
    select: { adminId: true, adminName: true, adminEmailId: true },
  });

  if (!admin) {
    return { success: true, message: 'If this email exists, an OTP has been sent.' };
  }

  const otp = generateOtp();
  console.log('[ForgotPassword] OTP:', otp);
  const otpGenerateDateTime = new Date();

  await prisma.tbladmins.update({
    where: { adminId: admin.adminId },
    data: { otp, otpGenerateDateTime },
  });

  const emailResult = await sendPasswordResetEmail(
    admin.adminName,
    admin.adminEmailId,
    otp
  );

  if (!emailResult.success) {
    console.error(`[Auth] Failed to send reset OTP to ${admin.adminEmailId}`);
  }

  await logEvent({
    eventDescription: `Password reset OTP requested by: "${admin.adminName}"`,
    adminId:          admin.adminId,
  });

  return {
    success: true,
    message: 'If this email exists, an OTP has been sent.',
    ...(process.env.NODE_ENV === 'development' && { otp }),
  };
};

// ─── Reset Password ───────────────────────────────────────────────────────────

export const resetPasswordService = async (
  adminEmailId: string,
  otp: string,
  newPassword: string
) => {
  const admin = await prisma.tbladmins.findFirst({
    where: { adminEmailId, status: 'Active' },
    select: {
      adminId:             true,
      adminName:           true,
      otp:                 true,
      otpGenerateDateTime: true,
    },
  });

  if (!admin) {
    return { success: false, message: 'Admin not found' };
  }

  const OTP_EXPIRY_MS = 5 * 60 * 1000;
  const otpAge = Date.now() - new Date(admin.otpGenerateDateTime!).getTime();

  if (!admin.otp || otpAge > OTP_EXPIRY_MS) {
    await prisma.tbladmins.update({
      where: { adminId: admin.adminId },
      data: { otp: undefined, otpGenerateDateTime: undefined },
    });
    await logEvent({
      eventDescription: `Password reset failed — OTP expired for: "${admin.adminName}"`,
      adminId:          admin.adminId,
    });
    return { success: false, message: 'OTP expired. Please request a new one.' };
  }

  if (admin.otp !== otp) {
    await logEvent({
      eventDescription: `Password reset failed — invalid OTP for: "${admin.adminName}"`,
      adminId:          admin.adminId,
    });
    return { success: false, message: 'Invalid OTP' };
  }

  await prisma.tbladmins.update({
    where: { adminId: admin.adminId },
    data: {
      adminPassword:       hashPassword(newPassword),
      otp:                 undefined,
      otpGenerateDateTime: undefined,
    },
  });

  await logEvent({
    eventDescription: `Password reset successfully for: "${admin.adminName}"`,
    adminId:          admin.adminId,
  });

  return { success: true, message: 'Password reset successful. Please login.' };
};