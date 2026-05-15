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

citiesRouter.get('/',      getCities);
citiesRouter.get('/:id',   getCity);
citiesRouter.post('/',     addCity);
citiesRouter.put('/:id',   editCity);
citiesRouter.delete('/:id', removeCity);
citiesRouter.patch('/:id/toggle-status', toggleStatus);

export default citiesRouter;