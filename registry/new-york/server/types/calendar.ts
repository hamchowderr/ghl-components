// GHL Calendar & Appointment Types

export interface GHLCalendar {
  id: string
  locationId: string
  name: string
  description?: string
  slug?: string
  widgetSlug?: string
  widgetType?: "default" | "classic"
  eventTitle?: string
  eventColor?: string
  meetingLocation?: string
  slotDuration?: number
  slotInterval?: number
  slotBuffer?: number
  preBuffer?: number
  appoinmentPerSlot?: number
  appoinmentPerDay?: number
  openHours?: GHLOpenHours[]
  enableRecurring?: boolean
  recurring?: GHLRecurringSettings
  formId?: string
  isActive: boolean
  notifications?: GHLCalendarNotifications
  teamMembers?: GHLCalendarTeamMember[]
  dateUpdated: string
}

export interface GHLOpenHours {
  daysOfTheWeek: number[]
  hours: Array<{ openHour: number; openMinute: number; closeHour: number; closeMinute: number }>
}

export interface GHLRecurringSettings {
  enabled: boolean
  frequency: "daily" | "weekly" | "monthly"
  interval: number
  endType: "never" | "count" | "date"
  endCount?: number
  endDate?: string
}

export interface GHLCalendarNotifications {
  shouldSendToContact: boolean
  shouldSendToUser: boolean
  shouldSendToGuest: boolean
}

export interface GHLCalendarTeamMember {
  userId: string
  priority: number
  meetingLocation?: string
}

export interface GHLAppointment {
  id: string
  locationId: string
  calendarId: string
  contactId: string
  title: string
  appointmentStatus: GHLAppointmentStatus
  startTime: string
  endTime: string
  timezone?: string
  notes?: string
  address?: string
  assignedUserId?: string
  meetingLink?: string
  dateAdded: string
  dateUpdated: string
}

export type GHLAppointmentStatus = "confirmed" | "cancelled" | "showed" | "noshow" | "invalid"

export interface GHLTimeSlot {
  startTime: string
  endTime: string
  available: boolean
}

export interface GHLAvailability {
  date: string
  slots: GHLTimeSlot[]
}

export interface GHLGetCalendarsRequest {
  locationId: string
}

export interface GHLGetAvailabilityRequest {
  calendarId: string
  startDate: string
  endDate: string
  timezone?: string
  userId?: string
}

export interface GHLGetAppointmentsRequest {
  locationId: string
  calendarId?: string
  contactId?: string
  startTime?: string
  endTime?: string
  limit?: number
  startAfter?: number
  startAfterId?: string
}

export interface GHLBookAppointmentRequest {
  calendarId: string
  locationId: string
  contactId: string
  startTime: string
  endTime: string
  title?: string
  notes?: string
  address?: string
  assignedUserId?: string
  timezone?: string
}

export interface GHLUpdateAppointmentRequest {
  id: string
  startTime?: string
  endTime?: string
  title?: string
  notes?: string
  address?: string
  appointmentStatus?: GHLAppointmentStatus
}

export interface GHLCancelAppointmentRequest {
  id: string
  reason?: string
}
