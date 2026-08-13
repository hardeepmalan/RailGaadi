export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminEmail: string;
  action: string;
  targetUserEmail?: string;
  details?: string;
}

const auditLogsStore: AuditLogEntry[] = [];

export function logAuditAction(adminEmail: string, action: string, targetUserEmail?: string, details?: string) {
  const entry: AuditLogEntry = {
    id: 'audit_' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    adminEmail,
    action,
    targetUserEmail,
    details,
  };
  auditLogsStore.unshift(entry);
  console.log(`🛡️ AUDIT LOG [${entry.timestamp}] Admin: ${adminEmail} Action: ${action} Target: ${targetUserEmail || 'N/A'}`);
}

export function getAuditLogs(): AuditLogEntry[] {
  return auditLogsStore.slice(0, 100);
}
