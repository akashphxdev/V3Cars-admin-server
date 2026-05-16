import { Router } from 'express';

import authRouter from '@/modules/auth/auth.routes';
import dashboardRoutes from '@/modules/dashboard/dashboard.routes';
import adminRouter from '@/modules/admin/admins/admin.routes';
import roleRouter from '@/modules/admin/roles/role.router';
import eventRouter from '@/modules/admin/events/event.routes';
import citiesRouter    from '@/modules/admin/cities/cities.routes';
import countriesRouter from '@/modules/admin/countries/countries.routes';
import districtRouter from '@/modules/admin/districts/district.router';
import brandsRouter from '@/modules/cars/brands/brands.routes';
import modelRoutes from "@/modules/cars/models/model.routes";


const router = Router();

router.use('/auth', authRouter);
router.use('/dashboard', dashboardRoutes);
router.use('/admins', adminRouter);
router.use('/roles', roleRouter);
router.use('/events', eventRouter);
router.use('/cities',    citiesRouter);
router.use('/countries', countriesRouter);
router.use('/districts', districtRouter);
router.use('/brands',  brandsRouter);
router.use("/models", modelRoutes);


export default router;