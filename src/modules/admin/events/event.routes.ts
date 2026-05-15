// src/modules/events/event.routes.ts

import { Router } from 'express';
import { getEvents } from './event.controller';

const eventRouter = Router();

eventRouter.get('/', getEvents); // GET /api/admin/events

export default eventRouter;