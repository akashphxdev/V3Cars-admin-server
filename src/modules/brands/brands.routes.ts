import { Router } from 'express';
import {
  getBrands,
  getBrand,
  addBrand,
  editBrand,
  toggleStatus,
  removeBrand,
} from './brands.controller';
import { authenticate } from '../../middlewares/authenticate';

const brandsRouter = Router();

// brandsRouter.use(authenticate);

// ─── CRUD ─────────────────────────────────────────────────────────────────────
brandsRouter.get('/',    getBrands);   // GET    /admin/v1/brands
brandsRouter.get('/:id', getBrand);    // GET    /admin/v1/brands/:id
brandsRouter.post('/',   addBrand);    // POST   /admin/v1/brands
brandsRouter.put('/:id', editBrand);   // PUT    /admin/v1/brands/:id
brandsRouter.delete('/:id', removeBrand); // DELETE /admin/v1/brands/:id

// ─── Extra ────────────────────────────────────────────────────────────────────
brandsRouter.patch('/:id/toggle-status', toggleStatus); // PATCH /admin/v1/brands/:id/toggle-status

export default brandsRouter;