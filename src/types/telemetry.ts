export interface TelemetryUser {
  email: string;
  isVerified: boolean;
  verifiedAt: string;
  adminRole?: 'admin' | 'user';
}

export interface TelemetryConsent {
  optedIn: boolean;
  consentTimestamp: string;
  version: string;
}

export interface UserEventLog {
  id: string;
  eventType: 'page_view' | 'action_click' | 'search_performed' | 'pnr_check' | 'coach_view' | 'alert_set' | 'session_heartbeat';
  eventName: string;
  pagePath: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface UserAnalyticsSession {
  sessionId: string;
  userEmail: string;
  isVerified: boolean;
  startTime: string;
  endTime?: string;
  totalTimeSeconds: number;
  lastActiveTime: string;
  isOnline: boolean;
  device: string;
  browser: string;
  country: string;
  pagesVisited: string[];
  events: UserEventLog[];
  sessionCount: number;
  isRepeatVisit: boolean;
}

export interface AnalyticsSummaryMetrics {
  totalActiveSessions: number;
  totalVerifiedUsers: number;
  avgTimeSpentSeconds: number;
  totalEventsTracked: number;
  topPages: { path: string; views: number }[];
}
