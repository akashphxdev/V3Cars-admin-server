// src/modules/admin/admin.router.ts

import { Router } from 'express';
import {
  getAdmins,
  getAdmin,
  addAdmin,
  editAdmin,
  lockUnlockAdmin,
  getPermissions,
  getRoles,
  getSubRoles,
  getRolePerms,
  createCustomRoleController,
} from './admin.controller';

const adminRouter = Router();

// adminRouter.use(authenticate);

// ─── Static routes PEHLE — warna /:id inhe pakad leta hai ────────────────────
adminRouter.get('/permissions',                  getPermissions);
adminRouter.get('/roles',                        getRoles);
adminRouter.get('/sub-roles/:parentId',          getSubRoles);
adminRouter.get('/role-permissions/:roleId',     getRolePerms);
adminRouter.post('/custom-role',                 createCustomRoleController);

// ─── CRUD ─────────────────────────────────────────────────────────────────────
adminRouter.get('/',     getAdmins);
adminRouter.get('/:id',  getAdmin);
adminRouter.post('/',    addAdmin);
adminRouter.put('/:id',  editAdmin);

// ─── Toggle Lock ──────────────────────────────────────────────────────────────
adminRouter.patch('/:id/toggle-lock', lockUnlockAdmin);

export default adminRouter;