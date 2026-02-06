// GHL Opportunity & Pipeline Types

export interface GHLPipeline {
  id: string
  locationId: string
  name: string
  stages: GHLPipelineStage[]
  showInFunnel: boolean
  showInPieChart: boolean
  dateAdded: string
  dateUpdated: string
}

export interface GHLPipelineStage {
  id: string
  name: string
  position: number
  showInFunnel: boolean
  showInPieChart: boolean
}

export interface GHLOpportunity {
  id: string
  locationId: string
  name: string
  pipelineId: string
  pipelineStageId: string
  status: GHLOpportunityStatus
  contactId: string
  monetaryValue?: number
  assignedTo?: string
  source?: string
  customFields?: Array<{ id: string; key: string; value: unknown }>
  followers?: string[]
  dateAdded: string
  dateUpdated: string
  lastStatusChangeAt?: string
  lastStageChangeAt?: string
  lastActivityAt?: string
  lostReasonId?: string
}

export type GHLOpportunityStatus = "open" | "won" | "lost" | "abandoned"

export interface GHLOpportunityFollower {
  id: string
  opportunityId: string
  userId: string
  dateAdded: string
}

export interface GHLGetPipelinesRequest {
  locationId: string
}

export interface GHLGetOpportunitiesRequest {
  locationId: string
  pipelineId?: string
  pipelineStageId?: string
  contactId?: string
  status?: GHLOpportunityStatus
  assignedTo?: string
  query?: string
  limit?: number
  startAfter?: number
  startAfterId?: string
}

export interface GHLSearchOpportunitiesRequest {
  locationId: string
  pipelineId?: string
  pipelineStageId?: string
  contactId?: string
  status?: GHLOpportunityStatus
  assignedTo?: string
  startDate?: string
  endDate?: string
  monetaryValue?: { min?: number; max?: number }
  query?: string
  limit?: number
  page?: number
}

export interface GHLCreateOpportunityRequest {
  locationId: string
  pipelineId: string
  pipelineStageId: string
  contactId: string
  name: string
  status?: GHLOpportunityStatus
  monetaryValue?: number
  assignedTo?: string
  source?: string
  customFields?: Array<{ id: string; value: unknown }>
}

export interface GHLUpdateOpportunityRequest {
  id: string
  name?: string
  pipelineStageId?: string
  status?: GHLOpportunityStatus
  monetaryValue?: number
  assignedTo?: string
  customFields?: Array<{ id: string; value: unknown }>
}

export interface GHLMoveOpportunityRequest {
  id: string
  pipelineStageId: string
}

export interface GHLUpdateOpportunityStatusRequest {
  id: string
  status: GHLOpportunityStatus
  lostReasonId?: string
}

export interface GHLAddFollowerRequest {
  opportunityId: string
  userId: string
}

export interface GHLRemoveFollowerRequest {
  opportunityId: string
  userId: string
}
