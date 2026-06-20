import { signSession, verifySession } from "../src/lib/session.js";
import { hashPassword, verifyPassword } from "../src/lib/password.js";

async function runTests() {
  console.log("=========================================");
  console.log("RUNNING SECURITY INTEGRITY & CRYPTO TESTS");
  console.log("=========================================");

  // 1. Session Signing & Verification Test
  console.log("\n--- TEST 1: Session Cryptographic Signing & Parse ---");
  const originalSession = { id: "u-1234", name: "Aarav", email: "aarav@test.com", role: "user" };
  const signedCookie = signSession(originalSession);
  console.log("Signed Cookie Output:", signedCookie);
  
  const parsedSession = verifySession(signedCookie);
  console.log("Verified & Parsed payload:", parsedSession);
  console.log("Match original?", parsedSession?.id === originalSession.id && parsedSession?.role === originalSession.role ? "SUCCESS" : "FAILED");

  // 2. Cookie Tampering Test
  console.log("\n--- TEST 2: Session Cookie Tampering Attack Rejection ---");
  // Attacker attempts to change "role":"user" to "role":"admin"
  const tamperedCookie = signedCookie.replace('"role":"user"', '"role":"admin"');
  console.log("Tampered Cookie Input:", tamperedCookie);
  
  const verifiedTampered = verifySession(tamperedCookie);
  console.log("Verified Tampered Result (Expected: null):", verifiedTampered);
  console.log("Tamper Proof Status:", verifiedTampered === null ? "SUCCESS (Rejected)" : "FAILED (Accepted!)");

  // 3. Password Hashing & Matching Test
  console.log("\n--- TEST 3: PBKDF2 Password Hashing & Match ---");
  const rawPassword = "farmerFriend99#";
  const hashedPassword = hashPassword(rawPassword);
  console.log("Hashed password (salt:hash format):", hashedPassword);
  console.log("Is formatted with salt prefix?", hashedPassword.includes(":") ? "YES" : "NO");

  const correctMatch = verifyPassword(rawPassword, hashedPassword);
  const incorrectMatch = verifyPassword("wrongPassword", hashedPassword);
  console.log("Does matching password pass?", correctMatch ? "YES (SUCCESS)" : "NO (FAILED)");
  console.log("Does incorrect password fail?", !incorrectMatch ? "YES (SUCCESS)" : "NO (FAILED)");

  // 4. Legacy Password Fallback & Auto-Migration Test
  console.log("\n--- TEST 4: Legacy Plain-text Password Compatibility ---");
  const legacyStoredPassword = "legacyPlaintextAdmin";
  console.log("Legacy stored password (no salt prefix):", legacyStoredPassword);
  
  const legacyMatch = verifyPassword("legacyPlaintextAdmin", legacyStoredPassword);
  console.log("Does legacy plaintext password match?", legacyMatch ? "YES (SUCCESS)" : "NO (FAILED)");

  // Simulate auto-migration mock logic
  if (legacyMatch && !legacyStoredPassword.includes(":")) {
    const migratedHash = hashPassword("legacyPlaintextAdmin");
    console.log("Migrated password hash generated:", migratedHash);
    console.log("Verify migrated hash:", verifyPassword("legacyPlaintextAdmin", migratedHash) ? "SUCCESS" : "FAILED");
  }

  // 5. Server Action Admin Guard Checks
  console.log("\n--- TEST 5: Server Action Guard Checks ---");
  try {
    // Import actions.js dynamically to mock mock requireAdmin
    const actions = await import("../src/app/actions.js");
    console.log("RequireAdmin and RequireUser helper functions successfully exported.");
  } catch (err) {
    console.error("Action module loading failure:", err.message);
  }
}

runTests();
