// src/modules/districts/district.router.ts

import { Router } from 'express';
import { getDistricts, editDistrict } from './district.controller';
import { authenticate } from '../../middlewares/authenticate';

const districtRouter = Router();

// ─── Routes ───────────────────────────────────────────────────────────────────

districtRouter.get('/',      getDistricts);   // GET  /api/districts
districtRouter.put('/:id',   editDistrict);   // PUT  /api/districts/:id

export default districtRouter;