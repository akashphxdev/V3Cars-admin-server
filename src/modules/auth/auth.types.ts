// src/modules/auth/auth.types.ts

export interface LoginPayload {
  adminEmailId: string;
  adminPassword: string;
}

export interface VerifyOtpPayload {
  adminEmailId: string;
  otp: string;
}

export interface AuthTokenPayload {
  adminId: number;
  adminType: number;
  adminSubType: number | null;
}// src/modules/auth/auth.types.ts

export interface LoginPayload {
  adminEmailId: string;
  adminPassword: string;
}

export interface VerifyOtpPayload {
  adminEmailId: string;
  otp: string;
}

export interface AuthTokenPayload {
  adminId: number;
  adminType: number;
  adminSubType: number | null;
}

// ─── Forgot / Reset Password ──────────────────────────────────────────────────

export interface ForgotPasswordPayload {
  adminEmailId: string;
}

export interface ResetPasswordPayload {
  adminEmailId: string;
  otp: string;
  newPassword: string;
}