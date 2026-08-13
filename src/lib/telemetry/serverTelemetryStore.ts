export interface ServerTelemetrySession {
  sessionId: string;
  userId: string;
  verifiedEmail: string;
  displayName: string;
  isAuthenticated: boolean;
  firstSeen: string;
  lastActiveTime: string;
  isOnline: boolean;
  sessionCount: number;
  isRepeatVisit: boolean;
  totalTimeSeconds: number;
  device: string;
  browser: string;
  os: string;
  country: string;
  timezone: string;
  screenSize: string;
  language: string;
  ip: string;
  pagesVisited: { path: string; title: string; visitedAt: string }[];
  events: { id: string; name: string; pagePath: string; metadata?: any; timestamp: string }[];
}

export interface UserSuggestionEntry {
  id: string;
  userId: string;
  verifiedEmail: string;
  userName: string;
  isAuthenticated: boolean;
  suggestionText: string;
  status: 'pending' | 'reviewed' | 'resolved';
  submittedAt: string;
  sessionId?: string;
}

// In-memory server state
const sessionsMap = new Map<string, ServerTelemetrySession>();
const userSuggestions: UserSuggestionEntry[] = [];

export function recordServerTelemetry(opts: {
  userId: string;
  verifiedEmail: string;
  displayName: string;
  isAuthenticated: boolean;
  pagePath: string;
  pageTitle?: string;
  eventName?: string;
  eventMeta?: any;
  device?: string;
  browser?: string;
  os?: string;
  country?: string;
  timezone?: string;
  screenSize?: string;
  language?: string;
  ip?: string;
  sessionId?: string;
}) {
  const now = new Date();
  const nowIso = now.toISOString();

  // Find existing session for this user — or by provided sessionId
  let session = opts.sessionId
    ? sessionsMap.get(opts.sessionId)
    : Array.from(sessionsMap.values()).find(s => s.userId === opts.userId && s.isOnline);

  if (!session) {
    const allUserSessions = Array.from(sessionsMap.values()).filter(s => s.userId === opts.userId);
    const sessionCount = allUserSessions.length + 1;

    session = {
      sessionId: opts.sessionId || ('sess_' + Math.random().toString(36).substring(2, 10)),
      userId: opts.userId,
      verifiedEmail: opts.verifiedEmail,
      displayName: opts.displayName,
      isAuthenticated: opts.isAuthenticated,
      firstSeen: nowIso,
      lastActiveTime: nowIso,
      isOnline: true,
      sessionCount,
      isRepeatVisit: sessionCount > 1,
      totalTimeSeconds: 0,
      device: opts.device || 'Desktop 💻',
      browser: opts.browser || 'Chrome',
      os: opts.os || 'Unknown OS',
      country: opts.country || 'India 🇮🇳',
      timezone: opts.timezone || 'Asia/Kolkata',
      screenSize: opts.screenSize || 'Unknown',
      language: opts.language || 'en',
      ip: opts.ip || 'Unknown',
      pagesVisited: [],
      events: [],
    };
  } else {
    session.lastActiveTime = nowIso;
    session.isOnline = true;
    const startMs = new Date(session.firstSeen).getTime();
    session.totalTimeSeconds = Math.max(0, Math.floor((now.getTime() - startMs) / 1000));
    // Update enriched fields if provided
    if (opts.country && opts.country !== 'India 🇮🇳') session.country = opts.country;
    if (opts.device) session.device = opts.device;
    if (opts.ip && opts.ip !== 'Unknown') session.ip = opts.ip;
  }

  // Add page visit
  const alreadyVisited = session.pagesVisited.find(p => p.path === opts.pagePath);
  if (!alreadyVisited) {
    session.pagesVisited.push({
      path: opts.pagePath,
      title: opts.pageTitle || opts.pagePath,
      visitedAt: nowIso,
    });
  }

  // Add event
  if (opts.eventName) {
    session.events.unshift({
      id: 'evt_' + Math.random().toString(36).substring(2, 8),
      name: opts.eventName,
      pagePath: opts.pagePath,
      metadata: opts.eventMeta,
      timestamp: nowIso,
    });
    session.events = session.events.slice(0, 100);
  }

  sessionsMap.set(session.sessionId, session);
  return session;
}

export function getAllServerSessions(): ServerTelemetrySession[] {
  const nowMs = Date.now();
  const list = Array.from(sessionsMap.values());
  // Evaluate live online status (active within last 60s)
  return list
    .map(s => {
      const lastActiveMs = new Date(s.lastActiveTime).getTime();
      return { ...s, isOnline: (nowMs - lastActiveMs) < 60000 };
    })
    .sort((a, b) => new Date(b.lastActiveTime).getTime() - new Date(a.lastActiveTime).getTime());
}

export function addServerSuggestion(opts: {
  userId: string;
  verifiedEmail: string;
  userName: string;
  isAuthenticated: boolean;
  suggestionText: string;
  sessionId?: string;
}): UserSuggestionEntry {
  const entry: UserSuggestionEntry = {
    id: 'sug_' + Math.random().toString(36).substring(2, 9),
    userId: opts.userId,
    verifiedEmail: opts.verifiedEmail,
    userName: opts.userName,
    isAuthenticated: opts.isAuthenticated,
    suggestionText: opts.suggestionText.trim(),
    status: 'pending',
    submittedAt: new Date().toISOString(),
    sessionId: opts.sessionId,
  };
  userSuggestions.unshift(entry);
  return entry;
}

export function getAllSuggestions(): UserSuggestionEntry[] {
  return userSuggestions;
}

export function updateSuggestionStatus(id: string, status: UserSuggestionEntry['status']) {
  const sug = userSuggestions.find(s => s.id === id);
  if (sug) sug.status = status;
}

export function deleteSessionByAdmin(sessionId: string) {
  sessionsMap.delete(sessionId);
}
