// src/modules/roles/role.router.ts

import { Router } from 'express';
import {
  getRoles,
  getRolesFlat,
  getRole,
  addRole,
  editRole,
  removeRole,
} from './role.controller';
import { authenticate } from '../../middlewares/authenticate';

const roleRouter = Router();

roleRouter.use(authenticate);

// Static routes pehle
roleRouter.get('/all', getRolesFlat); // dropdown ke liye

// CRUD
roleRouter.get('/',     getRoles);
roleRouter.get('/:id',  getRole);
roleRouter.post('/',    addRole);
roleRouter.put('/:id',  editRole);
roleRouter.delete('/:id', removeRole);

export default roleRouter;


// ─── app.ts mein add karo ─────────────────────────────────────────────────────
// import roleRouter from './modules/roles/role.router';
// app.use('/api/roles', roleRouter);