export interface GetEventsQuery {
  page?:      number;
  limit?:     number;
  adminId?:   number;
  search?:    string;
  startDate?: string;
  endDate?:   string;
}

export interface CreateEventPayload {
  eventDescription: string;
  ipAddress?:       string;
  adminId?:         number;
}