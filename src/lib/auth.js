import crypto from 'crypto';

const SECRET = process.env.ADMIN_JWT_SECRET || 'bx-bin-checker-super-secret-key-12984';

/**
 * Hashes a password using SHA-256.
 * @param {string} password 
 * @returns {string} Hashed hex string
 */
export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Creates a signed session token.
 * @param {object} user 
 * @returns {string} Session token
 */
export function createSession(user) {
  const payload = JSON.stringify({
    id: user.id,
    username: user.username,
    role: user.role,
    expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });
  
  const payloadBase64 = Buffer.from(payload).toString('base64');
  const signature = crypto.createHmac('sha256', SECRET).update(payloadBase64).digest('hex');
  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies a signed session token.
 * @param {string} token 
 * @returns {object|null} The verified payload or null if invalid
 */
export function verifySession(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  
  const payloadBase64 = parts[0];
  const signature = parts[1];
  
  const expectedSignature = crypto.createHmac('sha256', SECRET).update(payloadBase64).digest('hex');
  if (signature !== expectedSignature) return null;
  
  try {
    const payloadStr = Buffer.from(payloadBase64, 'base64').toString('utf8');
    const payload = JSON.parse(payloadStr);
    if (payload.expires < Date.now()) return null; // Expired
    return payload;
  } catch (err) {
    return null;
  }
}
