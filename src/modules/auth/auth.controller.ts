// src/modules/auth/auth.controller.ts

import { Request, Response } from 'express';
import { loginService, verifyOtpService, forgotPasswordService, resetPasswordService } from './auth.service';

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

export const login = async (req: Request, res: Response) => {
  try {
    const { adminEmailId, adminPassword } = req.body;

    if (!adminEmailId || !adminPassword) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const ip = req.ip || req.headers['x-forwarded-for'] as string || '';
    const result = await loginService({ adminEmailId, adminPassword }, ip);

    res.status(result.success ? 200 : 401).json(result);
  } catch (error) {
    console.error('[Auth Controller] login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── POST /api/auth/verify-otp ────────────────────────────────────────────────

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { adminEmailId, otp } = req.body;

    if (!adminEmailId || !otp) {
      res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
      return;
    }

    const ip = req.ip || req.headers['x-forwarded-for'] as string || '';
    const result = await verifyOtpService({ adminEmailId, otp }, ip);

    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('[Auth Controller] verifyOtp error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { adminEmailId } = req.body;
    if (!adminEmailId) {
      res.status(400).json({ success: false, message: 'Email is required' });
      return;
    }

    const result = await forgotPasswordService(adminEmailId);
    res.status(200).json(result); // Always 200 to prevent enumeration
  } catch (error) {
    console.error('[Auth Controller] forgotPassword error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── POST /api/auth/reset-password ───────────────────────────────────────────

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { adminEmailId, otp, newPassword } = req.body;

    if (!adminEmailId || !otp || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required',
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
      return;
    }

    const result = await resetPasswordService(adminEmailId, otp, newPassword);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('[Auth Controller] resetPassword error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};