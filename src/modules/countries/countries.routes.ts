import { Router } from 'express';
import {
  getCountries,
  getCountry,
  addCountry,
  editCountry,
  toggleStatus,
  removeCountry,
} from './countries.controller';
import { authenticate } from '../../middlewares/authenticate';

const countriesRouter = Router();

// countriesRouter.use(authenticate);

countriesRouter.get('/',     getCountries);   // GET    /admin/v1/countries
countriesRouter.get('/:id',  getCountry);     // GET    /admin/v1/countries/:id
countriesRouter.post('/',    addCountry);     // POST   /admin/v1/countries
countriesRouter.put('/:id',  editCountry);    // PUT    /admin/v1/countries/:id
countriesRouter.delete('/:id', removeCountry); // DELETE /admin/v1/countries/:id
countriesRouter.patch('/:id/toggle-status', toggleStatus); // PATCH /admin/v1/countries/:id/toggle-status

export default countriesRouter;