// GHL Contact Types

export interface GHLContact {
  id: string
  locationId: string
  firstName?: string
  lastName?: string
  name?: string
  email?: string
  phone?: string
  address1?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  companyName?: string
  website?: string
  timezone?: string
  dnd: boolean
  dndSettings?: GHLDndSettings
  tags?: string[]
  source?: string
  customFields?: GHLCustomFieldValue[]
  attributions?: GHLAttribution[]
  dateAdded: string
  dateUpdated: string
  dateOfBirth?: string
}

export interface GHLDndSettings {
  status: "active" | "inactive"
  message?: string
  code?: string
}

export interface GHLCustomFieldValue {
  id: string
  key: string
  value: string | string[] | number | boolean
  fieldType: GHLCustomFieldType
}

export type GHLCustomFieldType =
  | "TEXT"
  | "LARGE_TEXT"
  | "NUMERIC"
  | "PHONE"
  | "EMAIL"
  | "DATE"
  | "CHECKBOX"
  | "DROPDOWN"
  | "RADIO"
  | "MULTIPLE_OPTIONS"
  | "FILE"

export interface GHLAttribution {
  source?: string
  medium?: string
  campaign?: string
  content?: string
  term?: string
  referrer?: string
  sessionSource?: string
  landingPage?: string
}

export interface GHLContactNote {
  id: string
  contactId: string
  body: string
  userId?: string
  dateAdded: string
}

export interface GHLContactTask {
  id: string
  contactId: string
  title: string
  body?: string
  dueDate: string
  completed: boolean
  assignedTo?: string
  dateAdded: string
}

export interface GHLTag {
  id: string
  name: string
  locationId: string
}

export interface GHLCreateContactRequest {
  locationId: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address1?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  companyName?: string
  website?: string
  timezone?: string
  dnd?: boolean
  tags?: string[]
  source?: string
  customFields?: Array<{ id: string; value: string | string[] | number | boolean }>
}

export interface GHLUpdateContactRequest extends Partial<GHLCreateContactRequest> {
  id: string
}

export interface GHLSearchContactsRequest {
  locationId: string
  query?: string
  limit?: number
  startAfter?: number
  startAfterId?: string
  filters?: GHLContactFilter[]
}

export interface GHLContactFilter {
  field: string
  operator: "eq" | "neq" | "contains" | "startsWith" | "endsWith"
  value: string | number | boolean
}

export interface GHLAddTagRequest {
  contactId: string
  tags: string[]
}

export interface GHLRemoveTagRequest {
  contactId: string
  tags: string[]
}

export interface GHLCreateNoteRequest {
  contactId: string
  body: string
  userId?: string
}

export interface GHLCreateTaskRequest {
  contactId: string
  title: string
  body?: string
  dueDate: string
  assignedTo?: string
}
