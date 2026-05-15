import { Router } from 'express';
import adminRouter from '../modules/admins/admin.routes';
import authRouter from '../modules/auth/auth.routes';
import brandsRouter from '../modules/brands/brands.routes';
import countriesRouter from '../modules/countries/countries.routes';
import citiesRouter    from '../modules/cities/cities.routes';
import eventRouter from '../modules/events/event.routes';
import roleRouter from '../modules/roles/role.router';
import modelRoutes from "../modules/models/model.routes";
import districtRouter from '../modules/districts/district.router';

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