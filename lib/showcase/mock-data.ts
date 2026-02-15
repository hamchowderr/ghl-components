export const mockContacts = [
  {
    id: "mock-1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+15551234567",
    tags: ["VIP", "Lead"],
  },
  {
    id: "mock-2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah@example.com",
    phone: "+15559876543",
    tags: ["Customer", "Referral"],
  },
  {
    id: "mock-3",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael@example.com",
    phone: "+15555551234",
    tags: ["Lead"],
  },
];

export const mockAppointments = [
  {
    id: "apt-1",
    title: "Initial Consultation",
    startTime: "2026-02-07T10:00:00Z",
    endTime: "2026-02-07T11:00:00Z",
    appointmentStatus: "confirmed",
  },
  {
    id: "apt-2",
    title: "Follow-up Meeting",
    startTime: "2026-02-08T14:00:00Z",
    endTime: "2026-02-08T14:30:00Z",
    appointmentStatus: "new",
  },
  {
    id: "apt-3",
    title: "Demo Call",
    startTime: "2026-02-10T09:00:00Z",
    endTime: "2026-02-10T10:00:00Z",
    appointmentStatus: "confirmed",
  },
];

export const mockTimeSlots = [
  { startTime: "2026-02-07T09:00:00Z", endTime: "2026-02-07T09:30:00Z" },
  { startTime: "2026-02-07T09:30:00Z", endTime: "2026-02-07T10:00:00Z" },
  { startTime: "2026-02-07T10:00:00Z", endTime: "2026-02-07T10:30:00Z" },
  { startTime: "2026-02-07T10:30:00Z", endTime: "2026-02-07T11:00:00Z" },
  { startTime: "2026-02-07T11:00:00Z", endTime: "2026-02-07T11:30:00Z" },
  { startTime: "2026-02-07T14:00:00Z", endTime: "2026-02-07T14:30:00Z" },
  { startTime: "2026-02-07T14:30:00Z", endTime: "2026-02-07T15:00:00Z" },
  { startTime: "2026-02-07T15:00:00Z", endTime: "2026-02-07T15:30:00Z" },
];

export const mockChannels = [
  "SMS",
  "Email",
  "GMB",
  "FB",
  "IG",
  "WhatsApp",
  "Live_Chat",
  "Custom",
] as const;

export const mockMessages = [
  {
    id: "msg-1",
    conversationId: "conv-1",
    locationId: "loc-1",
    body: "Hi, I'm interested in your services. Can you tell me more?",
    direction: "inbound" as const,
    type: "SMS" as const,
    contentType: "text/plain" as const,
    dateAdded: "2026-02-14T10:00:00Z",
    status: "delivered" as const,
    contactId: "mock-1",
  },
  {
    id: "msg-2",
    conversationId: "conv-1",
    locationId: "loc-1",
    body: "Of course! We offer a full suite of marketing and CRM tools. Would you like to schedule a demo?",
    direction: "outbound" as const,
    type: "SMS" as const,
    contentType: "text/plain" as const,
    dateAdded: "2026-02-14T10:05:00Z",
    status: "delivered" as const,
    contactId: "mock-1",
  },
  {
    id: "msg-3",
    conversationId: "conv-1",
    locationId: "loc-1",
    body: "Yes, that sounds great. What times work?",
    direction: "inbound" as const,
    type: "SMS" as const,
    contentType: "text/plain" as const,
    dateAdded: "2026-02-14T10:10:00Z",
    status: "delivered" as const,
    contactId: "mock-1",
  },
  {
    id: "msg-4",
    conversationId: "conv-2",
    locationId: "loc-1",
    body: "Following up on our conversation about the proposal.",
    direction: "outbound" as const,
    type: "Email" as const,
    contentType: "text/plain" as const,
    dateAdded: "2026-02-14T09:00:00Z",
    status: "delivered" as const,
    contactId: "mock-2",
  },
  {
    id: "msg-5",
    conversationId: "conv-2",
    locationId: "loc-1",
    body: "Thanks for following up! I've reviewed the proposal and have a few questions.",
    direction: "inbound" as const,
    type: "Email" as const,
    contentType: "text/plain" as const,
    dateAdded: "2026-02-14T11:00:00Z",
    status: "delivered" as const,
    contactId: "mock-2",
  },
];

export const mockPipelineStages = [
  { id: "stage-1", name: "New Lead" },
  { id: "stage-2", name: "Qualified" },
  { id: "stage-3", name: "Proposal Sent" },
  { id: "stage-4", name: "Negotiation" },
  { id: "stage-5", name: "Closed Won" },
];

export const mockOpportunities = [
  {
    id: "opp-1",
    name: "Website Redesign",
    pipelineId: "pipe-1",
    pipelineStageId: "stage-2",
    status: "open" as const,
    contactId: "mock-1",
    monetaryValue: 5000,
    source: "Website",
    dateAdded: "2026-02-01T10:00:00Z",
    dateUpdated: "2026-02-10T15:00:00Z",
  },
  {
    id: "opp-2",
    name: "SEO Campaign",
    pipelineId: "pipe-1",
    pipelineStageId: "stage-3",
    status: "open" as const,
    contactId: "mock-2",
    monetaryValue: 3500,
    source: "Referral",
    dateAdded: "2026-02-05T14:00:00Z",
    dateUpdated: "2026-02-12T09:00:00Z",
  },
  {
    id: "opp-3",
    name: "Social Media Management",
    pipelineId: "pipe-1",
    pipelineStageId: "stage-1",
    status: "open" as const,
    contactId: "mock-3",
    monetaryValue: 2000,
    source: "Facebook Ad",
    dateAdded: "2026-02-10T08:00:00Z",
    dateUpdated: "2026-02-13T16:00:00Z",
  },
];

export type ComponentData = {
  name: string;
  title: string;
  description: string;
  category: "auth" | "contacts" | "calendars" | "server";
  dependencies?: string[];
};

export const componentRegistry: ComponentData[] = [
  {
    name: "ghl-provider",
    title: "GHL Provider",
    description:
      "Context provider for GoHighLevel authentication, token management, and location context.",
    category: "auth",
  },
  {
    name: "ghl-connect-button",
    title: "GHL Connect Button",
    description: "OAuth connect button for GoHighLevel authentication.",
    category: "auth",
    dependencies: ["button", "ghl-provider"],
  },
  {
    name: "ghl-oauth-callback",
    title: "GHL OAuth Callback",
    description: "Callback page handler for GoHighLevel OAuth flow.",
    category: "auth",
    dependencies: ["card", "skeleton", "alert", "ghl-provider"],
  },
  {
    name: "ghl-location-switcher",
    title: "GHL Location Switcher",
    description: "Switch between GHL locations for agency accounts.",
    category: "auth",
    dependencies: ["select", "avatar", "badge", "ghl-provider"],
  },
  {
    name: "ghl-contact-card",
    title: "GHL Contact Card",
    description:
      "Display card for a GoHighLevel contact with name, email, phone, and tags.",
    category: "contacts",
    dependencies: ["card", "avatar", "badge", "dropdown-menu", "ghl-provider"],
  },
  {
    name: "ghl-contact-form",
    title: "GHL Contact Form",
    description: "Create or edit a GoHighLevel contact with full validation.",
    category: "contacts",
    dependencies: [
      "card",
      "input",
      "label",
      "button",
      "switch",
      "badge",
      "alert",
      "command",
      "popover",
      "ghl-provider",
    ],
  },
  {
    name: "ghl-contact-list",
    title: "GHL Contact List",
    description: "Scrollable list of GoHighLevel contacts with pagination.",
    category: "contacts",
    dependencies: ["scroll-area", "card", "skeleton", "pagination", "ghl-provider"],
  },
  {
    name: "ghl-contact-search",
    title: "GHL Contact Search",
    description:
      "Search input with typeahead for finding GoHighLevel contacts.",
    category: "contacts",
    dependencies: ["command", "popover", "input", "ghl-provider"],
  },
  {
    name: "ghl-contact-picker",
    title: "GHL Contact Picker",
    description: "Modal dialog to select one or more GoHighLevel contacts.",
    category: "contacts",
    dependencies: ["dialog", "command", "input", "button", "ghl-provider"],
  },
  {
    name: "ghl-tag-manager",
    title: "GHL Tag Manager",
    description:
      "Add and remove tags from a GoHighLevel contact with autocomplete.",
    category: "contacts",
    dependencies: ["popover", "command", "badge", "input", "ghl-provider"],
  },
  {
    name: "ghl-time-slot-grid",
    title: "GHL Time Slot Grid",
    description:
      "Visual time slot grid component that displays available time slots in a responsive grid.",
    category: "calendars",
    dependencies: ["button", "badge"],
  },
  {
    name: "ghl-availability-picker",
    title: "GHL Availability Picker",
    description:
      "Availability picker component with calendar and time slot selection.",
    category: "calendars",
    dependencies: [
      "calendar",
      "button",
      "scroll-area",
      "skeleton",
      "ghl-time-slot-grid",
      "ghl-provider",
    ],
  },
  {
    name: "ghl-webhook-handler",
    title: "GHL Webhook Handler",
    description:
      "Server-side utilities for handling GoHighLevel webhooks with signature verification.",
    category: "server",
  },
  {
    name: "ghl-types",
    title: "GHL Types",
    description: "TypeScript types for GoHighLevel entities.",
    category: "server",
  },
];
