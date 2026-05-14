// src/modules/events/event.controller.ts

import { Request, Response } from 'express';
import { getAllEvents } from './event.service';

// ─── GET /api/admin/events ────────────────────────────────────────────────────

export const getEvents = async (req: Request, res: Response) => {
  try {
    const result = await getAllEvents(req.query as any);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('[Events] getEvents error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};