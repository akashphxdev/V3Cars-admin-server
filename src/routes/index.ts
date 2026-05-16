// src/routes/index.ts
import { Router } from 'express';

import { authenticate } from '@/middlewares/authenticate';

import authRouter        from '@/modules/auth/auth.routes';
import dashboardRoutes   from '@/modules/dashboard/dashboard.routes';
import adminRouter       from '@/modules/admin/admins/admin.routes';
import roleRouter        from '@/modules/admin/roles/role.router';
import apiManagementRouter from '@/modules/admin/apiManagement/apiManagement.router';
import eventRouter       from '@/modules/admin/events/event.routes';
import citiesRouter      from '@/modules/admin/cities/cities.routes';
import countriesRouter   from '@/modules/admin/countries/countries.routes';
import districtRouter    from '@/modules/admin/districts/district.router';
import brandsRouter      from '@/modules/cars/brands/brands.routes';
import modelRoutes       from '@/modules/cars/models/model.routes';

const router = Router();

// ─── Public Routes (no auth) ──────────────────────────────────────────────────
router.use('/auth', authRouter);

// ─── Protected Routes (authenticate middleware) ───────────────────────────────
router.use('/dashboard',      authenticate, dashboardRoutes);
router.use('/admins',         authenticate, adminRouter);
router.use('/roles',          authenticate, roleRouter);
router.use('/api-management', authenticate, apiManagementRouter);
router.use('/events',         authenticate, eventRouter);
router.use('/cities',         authenticate, citiesRouter);
router.use('/countries',      authenticate, countriesRouter);
router.use('/districts',      authenticate, districtRouter);
router.use('/brands',         authenticate, brandsRouter);
router.use('/models',         authenticate, modelRoutes);

export default router;