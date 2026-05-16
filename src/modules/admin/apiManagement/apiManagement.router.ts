// src/modules/admin/apiManagement/apiManagement.router.ts

import { Router }                                              from 'express';
import { getApis, getApi, addApi, editApi, toggleStatus }     from '@/modules/admin/apiManagement/apiManagement.controller';

const apiManagementRouter = Router();

// ─── CRUD ─────────────────────────────────────────────────────────────────────
apiManagementRouter.get('/',    getApis);
apiManagementRouter.get('/:id', getApi);
apiManagementRouter.post('/',   addApi);
apiManagementRouter.put('/:id', editApi);

// ─── Toggle Status ────────────────────────────────────────────────────────────
apiManagementRouter.patch('/:id/toggle-status', toggleStatus);

export default apiManagementRouter;