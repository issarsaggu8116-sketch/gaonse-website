import crypto from "crypto";

const ITERATIONS = 10000; // 10k iterations is standard and secure for PBKDF2
const KEY_LEN = 64;       // 64 bytes hash output
const ALGORITHM = "sha512";

/**
 * Hashes a password using PBKDF2 with a random 16-byte salt.
 * Returns the hash in the format "salt:hashHex"
 */
export function hashPassword(password) {
  if (!password) return "";
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, ALGORITHM).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against its stored representation.
 * Supports legacy plain-text passwords for seamless auto-migration.
 */
export function verifyPassword(password, storedPassword) {
  if (!password || !storedPassword) return false;
  
  // If the stored password does not contain a colon, it is a legacy plain-text entry
  if (!storedPassword.includes(":")) {
    return password === storedPassword;
  }
  
  const parts = storedPassword.split(":");
  if (parts.length < 2) return false;
  
  const [salt, hash] = parts;
  const testHash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, ALGORITHM).toString("hex");
  return hash === testHash;
}
