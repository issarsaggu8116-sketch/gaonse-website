import mongoose from "mongoose";
import User from "../src/models/User.js";
import dotenv from "dotenv";
import fs from "fs";

// Read .env.local manually since we don't have dotenv loaded by Next.js
const envFile = fs.readFileSync(".env.local", "utf8");
const envConfig = envFile.split("\n").reduce((acc, line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || "";
    // Remove quotes
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    acc[key] = value;
  }
  return acc;
}, {});

const MONGODB_URI = envConfig.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    const adminEmail = "admin-harvest-master@gaonse.com";
    const adminPasswordHash = "38be192cf427f1d699f9348ef751c77e:1c1ddf709a40cb968db0718cd40abd56bc02995e44326ec2c493d1ce6097b56e7de3e10508d62950fe9b26e314ef6626fb40bdf62cfce89892852ba8a06097f3";

    console.log(`Checking if admin user exists (${adminEmail})...`);
    let user = await User.findOne({ email: adminEmail });

    if (user) {
      console.log("Admin user found. Restoring roles and password hash...");
      user.password = adminPasswordHash;
      user.role = "admin";
      user.isVerified = true;
      await user.save();
      console.log("Admin user updated successfully!");
    } else {
      console.log("Admin user not found. Creating a new admin user...");
      user = new User({
        _id: "u-admin",
        name: "GaonSe Admin Master",
        email: adminEmail,
        password: adminPasswordHash,
        role: "admin",
        isVerified: true
      });
      await user.save();
      console.log("Admin user created successfully!");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed.");
  }
}

seedAdmin();
