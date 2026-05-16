// src/modules/dashboard/dashboard.controller.ts

import { Request, Response } from 'express';
import { getDashboardMetrics } from './dashboard.service';

export const dashboardMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getDashboardMetrics();

    res.status(200).json({
      success: true,
      message: 'Dashboard metrics fetched successfully',
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message ?? 'Something went wrong',
    });
  }
};