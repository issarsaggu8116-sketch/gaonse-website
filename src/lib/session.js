import crypto from "crypto";

// Load secret key or fall back to a random persistent key generated on startup
let secret = process.env.SESSION_SECRET;
if (!secret) {
  // Use a global cached key so that hot-reloads in dev don't immediately log out users,
  // but generate a secure random string for safety.
  if (!global._gaonseSessionSecret) {
    global._gaonseSessionSecret = crypto.randomBytes(32).toString("hex");
  }
  secret = global._gaonseSessionSecret;
}

/**
 * Signs a session data payload by appending an HMAC signature.
 * Returns "JSONString.hexSignature"
 */
export function signSession(sessionData) {
  const dataStr = JSON.stringify(sessionData);
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(dataStr);
  const signature = hmac.digest("hex");
  return `${dataStr}.${signature}`;
}

/**
 * Verifies the signature of a session cookie value and returns the parsed payload.
 * Returns null if the signature is invalid or parsing fails.
 */
export function verifySession(cookieValue) {
  if (!cookieValue) return null;
  
  const parts = cookieValue.split(".");
  if (parts.length < 2) return null;
  
  const signature = parts.pop();
  const dataStr = parts.join("."); // Join remaining parts in case payload contained dots
  
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(dataStr);
  const expectedSignature = hmac.digest("hex");
  
  if (signature !== expectedSignature) {
    console.warn("[GaonSe Security Warning] Session cookie signature mismatch! Potential tampering attempt.");
    return null;
  }
  
  try {
    return JSON.parse(dataStr);
  } catch (e) {
    return null;
  }
}
