import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Order from "@/models/Order";

// Helper to ensure database is connected
async function connect() {
  await dbConnect();
}

// User CRUD Helpers
export async function getUsers() {
  await connect();
  const users = await User.find({}).lean();
  const serialized = JSON.parse(JSON.stringify(users));
  return serialized.map(u => ({ ...u, id: u._id }));
}

export async function findUserByEmail(email) {
  await connect();
  if (!email) return null;
  const user = await User.findOne({ email: email.toLowerCase().trim() }).lean();
  if (!user) return null;
  const serialized = JSON.parse(JSON.stringify(user));
  return { ...serialized, id: serialized._id };
}

export async function createUser(user) {
  await connect();
  const newUser = new User({
    _id: `u-${Date.now()}`,
    role: "user", // Default role
    ...user,
  });
  await newUser.save();
  const serialized = JSON.parse(JSON.stringify(newUser));
  return { ...serialized, id: serialized._id };
}

// Product CRUD Helpers
export async function getProducts() {
  await connect();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();
  const serialized = JSON.parse(JSON.stringify(products));
  return serialized.map(p => ({ ...p, id: p._id }));
}

export async function addProduct(product) {
  await connect();
  const newProduct = new Product({
    _id: `p-${Date.now()}`,
    rating: 5.0,
    reviews: [],
    ...product,
  });
  await newProduct.save();

  // Recalculate categories count
  const cat = await Category.findOne({ name: { $regex: new RegExp("^" + product.category + "$", "i") } });
  if (cat) {
    cat.count += 1;
    await cat.save();
  }

  return JSON.parse(JSON.stringify(newProduct));
}

export async function updateProduct(id, updatedFields) {
  await connect();
  await Product.findByIdAndUpdate(id, { $set: updatedFields });
  return true;
}

export async function deleteProduct(id) {
  await connect();
  const targetProduct = await Product.findById(id);
  if (!targetProduct) return false;

  await Product.findByIdAndDelete(id);

  // Update categories count
  const cat = await Category.findOne({ name: { $regex: new RegExp("^" + targetProduct.category + "$", "i") } });
  if (cat) {
    cat.count = Math.max(0, cat.count - 1);
    await cat.save();
  }

  return true;
}

// Category CRUD Helpers
export async function getCategories() {
  await connect();
  const categories = await Category.find({}).lean();
  return JSON.parse(JSON.stringify(categories));
}

export async function addCategory(category) {
  await connect();
  // Check duplicate
  const exists = await Category.findOne({
    $or: [
      { name: { $regex: new RegExp("^" + category.name + "$", "i") } },
      { slug: { $regex: new RegExp("^" + category.slug + "$", "i") } }
    ]
  });
  if (exists) {
    throw new Error("Category already exists.");
  }

  const newCategory = new Category({
    _id: category.slug,
    count: 0,
    ...category,
  });
  await newCategory.save();
  return JSON.parse(JSON.stringify(newCategory));
}

// Orders CRUD Helpers
export async function getOrders() {
  await connect();
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
  const serialized = JSON.parse(JSON.stringify(orders));
  return serialized.map(o => ({ ...o, id: o._id }));
}

export async function createOrder(order) {
  await connect();
  const newOrder = new Order({
    _id: `GS-${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date().toISOString().split("T")[0],
    status: "Pending", // Pending, Dispatched, Delivered
    trackingId: "",
    ...order,
  });
  await newOrder.save();
  const serialized = JSON.parse(JSON.stringify(newOrder));
  return { ...serialized, id: serialized._id };
}

export async function updateOrderStatus(orderId, status, trackingId = "") {
  await connect();
  await Order.findByIdAndUpdate(orderId, { $set: { status, trackingId } });
  return true;
}
