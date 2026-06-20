import { hashPassword } from "../src/lib/password.js";
const password = "GSe-984_Guest_Secure_Customer_#2026!";
const hashed = hashPassword(password);
console.log("Hashed Password:", hashed);
