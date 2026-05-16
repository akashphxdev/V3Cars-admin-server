// src/modules/dashboard/dashboard.routes.ts

import { Router } from 'express';
import { dashboardMetrics } from './dashboard.controller';

const router = Router();

// GET /admin/v1/dashboard
router.get('/metrics', dashboardMetrics);

export default router;