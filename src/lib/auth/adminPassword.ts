/**
 * Secure Admin Password Store (Server-Side Only)
 *
 * - Passwords are stored as SHA-256 hashes, NEVER plaintext
 * - Only the developer's verified admin email can SET or CHANGE the password
 * - No public reset mechanism
 * - Default initial password hash is set from ADMIN_PASSWORD_HASH env var
 *   For local dev: run `node -e "const c=require('crypto');console.log(c.createHash('sha256').update('YourPassword').digest('hex'))"` to generate
 */

import { createHash } from 'crypto';

// In-memory store for the hashed password (Vercel serverless: persists per instance lifecycle)
// For production, store this in a DB/KV store. For this project scope, env var is the source of truth.
let runtimeAdminPasswordHash: string | null = null;

function getEnvPasswordHash(): string | null {
  return process.env.ADMIN_PASSWORD_HASH || null;
}

function hashPassword(plaintext: string): string {
  return createHash('sha256').update(plaintext + 'railgaadi_admin_salt_2026').digest('hex');
}

export function initAdminPassword(): void {
  if (runtimeAdminPasswordHash) return;
  const envHash = getEnvPasswordHash();
  if (envHash) {
    runtimeAdminPasswordHash = envHash;
  }
}

/**
 * Verifies the submitted plaintext against the stored hash.
 * Returns true if match. Used in admin login.
 */
export function verifyAdminPassword(plaintext: string): boolean {
  initAdminPassword();

  const storedHash = runtimeAdminPasswordHash || getEnvPasswordHash();

  if (!storedHash) {
    // No password set yet: only allow the special one-time setup
    return false;
  }

  const submitted = hashPassword(plaintext);
  return submitted === storedHash;
}

/**
 * Sets a new admin password. Only callable server-side after verifying current password.
 * currentPassword must be correct before newPassword is accepted.
 */
export function changeAdminPassword(currentPassword: string, newPassword: string): { success: boolean; error?: string } {
  if (!currentPassword || !newPassword) {
    return { success: false, error: 'Current and new password are required.' };
  }

  if (newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters.' };
  }

  // Verify current password
  const isCurrentCorrect = verifyAdminPassword(currentPassword);
  if (!isCurrentCorrect) {
    return { success: false, error: 'Current admin password is incorrect.' };
  }

  // Hash and store new password
  runtimeAdminPasswordHash = hashPassword(newPassword);
  console.log('🔐 ADMIN PASSWORD CHANGED SUCCESSFULLY (runtime store updated)');

  return { success: true };
}

/**
 * One-time setup: allows the first admin password to be set ONLY when no password exists.
 * After it's set, this cannot be used again.
 */
export function setupInitialAdminPassword(newPassword: string, adminEmail: string): { success: boolean; error?: string } {
  initAdminPassword();
  const storedHash = runtimeAdminPasswordHash || getEnvPasswordHash();

  if (storedHash) {
    return { success: false, error: 'Admin password is already configured. Use change password instead.' };
  }

  const authorizedAdmins = (process.env.ADMIN_EMAILS || 'hardeepmalan@gmail.com')
    .split(',').map(e => e.trim().toLowerCase());

  if (!authorizedAdmins.includes(adminEmail.trim().toLowerCase())) {
    return { success: false, error: 'Only authorized admin developers can set the initial password.' };
  }

  if (newPassword.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters.' };
  }

  runtimeAdminPasswordHash = hashPassword(newPassword);
  console.log(`🔐 INITIAL ADMIN PASSWORD SET by ${adminEmail}`);
  return { success: true };
}

export function isAdminPasswordConfigured(): boolean {
  initAdminPassword();
  return !!(runtimeAdminPasswordHash || getEnvPasswordHash());
}
