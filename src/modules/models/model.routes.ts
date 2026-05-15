// src/modules/models/model.routes.ts

import { Router } from 'express';
import { getModelsByBrand } from './model.controller';

const router = Router();

// GET /admin/v1/models/:brandId
router.get('/:brandId', getModelsByBrand);

export default router;