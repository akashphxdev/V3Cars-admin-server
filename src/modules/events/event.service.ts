import prisma from '../../config/db';
import { GetEventsQuery, CreateEventPayload } from './event.types';

const serializeEvent = (event: any) => ({
  ...event,
  eventId: Number(event.eventId),
});

export const getAllEvents = async (query: GetEventsQuery) => {
  const page  = Number(query.page)  || 1;
  const limit = Number(query.limit) || 10;
  const skip  = (page - 1) * limit;

  const where: any = {};

  if (query.adminId !== undefined) where.adminId = Number(query.adminId);

  if (query.search) {
    where.OR = [
      { eventDescription: { contains: query.search } },
      { ipAddress:        { contains: query.search } },
    ];
  }

  if (query.startDate || query.endDate) {
    where.eventTime = {};
    if (query.startDate) where.eventTime.gte = new Date(query.startDate);
    if (query.endDate)   where.eventTime.lte = new Date(query.endDate);
  }

  const [events, total] = await Promise.all([
    prisma.tblevents.findMany({
      where,
      select: {
        eventId:          true,
        eventDescription: true,
        ipAddress:        true,
        eventTime:        true,
        adminId:          true,
      },
      skip,
      take:    limit,
      orderBy: { eventId: 'desc' },
    }),
    prisma.tblevents.count({ where }),
  ]);

  const adminIds = [...new Set(events.map(e => e.adminId).filter(Boolean))] as number[];

  const admins = adminIds.length > 0
    ? await prisma.tbladmins.findMany({
        where:  { adminId: { in: adminIds } },
        select: { adminId: true, adminName: true },
      })
    : [];

  const adminMap = new Map(admins.map(a => [a.adminId, a.adminName]));

  return {
    data: events.map(e => ({
      ...serializeEvent(e),
      adminName: adminMap.get(e.adminId) ?? `Admin #${e.adminId}`,
    })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const logEvent = async (payload: CreateEventPayload) => {
  const { eventDescription, ipAddress, adminId = 0 } = payload;

  const event = await prisma.tblevents.create({
    data: {
      eventDescription,
      ipAddress,
      adminId,
      eventTime: new Date(),
    },
    select: {
      eventId:          true,
      eventDescription: true,
      ipAddress:        true,
      eventTime:        true,
      adminId:          true,
    },
  });

  return serializeEvent(event);
};