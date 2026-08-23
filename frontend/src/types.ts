export type ApplicationStatus = "SAVED" | "APPLIED" | "IN_PROGRESS" | "FINISHED";
export type WorkMode = "REMOTE" | "HYBRID" | "ONSITE";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiErrorBody {
  status?: number;
  message?: string;
  timestamp?: string;
}

export interface JobApplication {
  id: string;
  title: string;
  description: string | null;
  status: ApplicationStatus;
  company: string;
  jobUrl: string | null;
  location: string | null;
  salaryRange: string | null;
  workMode: WorkMode | null;
  mainRequirements: string | null;
  desiredRequirements: string | null;
  processDetails: string | null;
  notes: string | null;
  appliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobPayload {
  title: string;
  description: string | null;
  company: string;
  jobUrl: string | null;
  location: string | null;
  salaryRange: string | null;
  workMode: WorkMode | null;
  mainRequirements: string | null;
  desiredRequirements: string | null;
  processDetails: string | null;
  notes: string | null;
  appliedAt: string | null;
}

export interface JobFilters {
  status?: ApplicationStatus | "";
  workMode?: WorkMode | "";
  company?: string;
  search?: string;
}
