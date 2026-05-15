import { Router } from 'express';
import adminRouter from '../modules/admin/admins/admin.routes';
import authRouter from '../modules/auth/auth.routes';
import brandsRouter from '../modules/cars/brands/brands.routes';
import countriesRouter from '../modules/admin/countries/countries.routes';
import citiesRouter    from '../modules/admin/cities/cities.routes';
import eventRouter from '../modules/admin/events/event.routes';
import roleRouter from '../modules/admin/roles/role.router';
import modelRoutes from "../modules/cars/models/model.routes";
import districtRouter from '../modules/admin/districts/district.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/admins', adminRouter);
router.use('/roles', roleRouter);
router.use('/brands',  brandsRouter);
router.use('/countries', countriesRouter);
router.use('/cities',    citiesRouter);
router.use('/events', eventRouter);
router.use("/models", modelRoutes);
router.use('/districts', districtRouter);


export default router;