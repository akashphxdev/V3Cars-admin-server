// src/modules/roles/role.router.ts

import { Router } from 'express';
import {
  getRoles,
  getParentRoles,
  getRole,
  addRole,
  editRole,
  removeRole,
} from './role.controller';
import { authenticate } from '../../middlewares/authenticate';

const roleRouter = Router();

roleRouter.use(authenticate);

// Static routes pehle
roleRouter.get('/parents', getParentRoles); // new role banate waqt parent dropdown

// CRUD
roleRouter.get('/',       getRoles);
roleRouter.get('/:id',    getRole);
roleRouter.post('/',      addRole);
roleRouter.put('/:id',    editRole);
roleRouter.delete('/:id', removeRole);

export default roleRouter;