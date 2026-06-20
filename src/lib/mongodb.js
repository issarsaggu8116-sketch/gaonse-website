import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
import User from "@/models/User";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Order from "@/models/Order";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  // Trigger check and automatic import seeding from db.json
  await seedDatabase();

  return cached.conn;
}

async function seedDatabase() {
  try {
    const productCount = await Product.countDocuments();
    if (productCount > 0) {
      return; // Database is already seeded
    }

    console.log("MongoDB database is empty! Starting auto-seeding from db.json...");

    const dbJsonPath = path.join(process.cwd(), "src/data/db.json");
    let fileContent;
    try {
      fileContent = await fs.readFile(dbJsonPath, "utf-8");
    } catch (err) {
      console.log("No local db.json found to seed from, skipping auto-seeding.");
      return;
    }

    const localDb = JSON.parse(fileContent);

    // 1. Seed Categories
    if (localDb.categories && localDb.categories.length > 0) {
      const categoriesToSeed = localDb.categories.map((cat) => ({
        _id: cat.slug,
        name: cat.name,
        slug: cat.slug,
        count: cat.count || 0,
        image: cat.image,
      }));
      await Category.insertMany(categoriesToSeed);
      console.log(`Seeded ${categoriesToSeed.length} categories to MongoDB.`);
    }

    // 2. Seed Products
    if (localDb.products && localDb.products.length > 0) {
      const productsToSeed = localDb.products.map((p) => ({
        _id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        price: p.price,
        description: p.description,
        longDescription: p.longDescription || "",
        ingredients: p.ingredients || [],
        benefits: p.benefits || [],
        images: p.images || [],
        video: p.video || "",
        weightOptions: p.weightOptions || [],
        rating: p.rating || 5.0,
        reviews: p.reviews || [],
        origin: p.origin,
        farmer: p.farmer || "",
        farmerImage: p.farmerImage || "",
        farmerStory: p.farmerStory || "",
        inStock: p.inStock !== undefined ? p.inStock : true,
        isFeatured: p.isFeatured !== undefined ? p.isFeatured : false,
      }));
      await Product.insertMany(productsToSeed);
      console.log(`Seeded ${productsToSeed.length} products to MongoDB.`);
    }

    // 3. Seed Users
    if (localDb.users && localDb.users.length > 0) {
      const usersToSeed = localDb.users.map((u) => ({
        _id: u.id,
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role || "user",
        isVerified: u.role === "admin" || u.role === "user",
      }));
      await User.insertMany(usersToSeed);
      console.log(`Seeded ${usersToSeed.length} users to MongoDB.`);
    }

    // 4. Seed Orders
    if (localDb.orders && localDb.orders.length > 0) {
      const ordersToSeed = localDb.orders.map((o) => ({
        _id: o.id,
        date: o.date,
        status: o.status || "Pending",
        trackingId: o.trackingId || "",
        cart: o.cart || [],
        shippingDetails: o.shippingDetails,
        subtotal: o.subtotal,
        discount: o.discount || 0,
        delivery: o.delivery,
        gst: o.gst,
        total: o.total,
      }));
      await Order.insertMany(ordersToSeed);
      console.log(`Seeded ${ordersToSeed.length} orders to MongoDB.`);
    }

    console.log("Auto-seeding from db.json completed successfully!");
  } catch (error) {
    console.error("Auto-seeding failed:", error);
  }
}

export default dbConnect;
