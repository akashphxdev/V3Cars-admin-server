// src/brands/routes/brand.routes.ts

import { Router } from "express";
import { brandController } from "./brands.controller";

const router = Router();

// GET /api/brands
router.get("/all", brandController.getAllBrandNames);

export default router;