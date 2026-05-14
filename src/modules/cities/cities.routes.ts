import { Router } from 'express';
import {
  getCities,
  getCity,
  addCity,
  editCity,
  toggleStatus,
  removeCity,
} from './cities.controller';
import { authenticate } from '../../middlewares/authenticate';

const citiesRouter = Router();

// citiesRouter.use(authenticate);

citiesRouter.get('/',      getCities);    // GET    /admin/v1/cities
citiesRouter.get('/:id',   getCity);      // GET    /admin/v1/cities/:id
citiesRouter.post('/',     addCity);      // POST   /admin/v1/cities
citiesRouter.put('/:id',   editCity);     // PUT    /admin/v1/cities/:id
citiesRouter.delete('/:id', removeCity);  // DELETE /admin/v1/cities/:id
citiesRouter.patch('/:id/toggle-status', toggleStatus); // PATCH /admin/v1/cities/:id/toggle-status

export default citiesRouter;