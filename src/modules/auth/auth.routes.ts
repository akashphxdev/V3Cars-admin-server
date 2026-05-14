import { Router } from 'express';
import { login, verifyOtp, forgotPassword, resetPassword } from './auth.controller';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/verify-otp', verifyOtp);
authRouter.post('/forgot-password', forgotPassword);  // Step 1: send reset OTP
authRouter.post('/reset-password', resetPassword);    // Step 2: verify OTP + set new password

export default authRouter;