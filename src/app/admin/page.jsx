"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  getProductsAction, 
  addProductAction, 
  updateProductAction, 
  deleteProductAction, 
  getCategoriesAction, 
  addCategoryAction, 
  getOrdersAction, 
  updateOrderStatusAction 
} from "@/app/actions";
import { 
  ShieldAlert, 
  Package, 
  Plus, 
  Trash2, 
  Edit, 
  FileText, 
  Check, 
  Tag, 
  Layers,
  ArrowRight,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Search,
  X
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  // Selected Tab: products, categories, orders
  const [activeTab, setActiveTab] = useState("products");
  
  // Dynamic Data Lists
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Forms Visibility
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Product Form Fields state
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Jaggery",
    price: "",
    description: "",
    longDescription: "",
    ingredients: "",
    benefits: "",
    images: "",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    origin: "",
    farmer: "",
    farmerImage: "",
    farmerStory: "",
    inStock: true,
    isFeatured: false,
    weightOptions: [{ weight: "250g", price: 150 }]
  });

  // Category Form Fields state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    image: ""
  });

  // Selected Order Detail state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderUpdateStatus, setOrderUpdateStatus] = useState("Pending");
  const [orderTrackingId, setOrderTrackingId] = useState("");

  // Product List Filter Search
  const [productSearch, setProductSearch] = useState("");

  // Load all server-side database tables on mount
  useEffect(() => {
    if (user && isAdmin) {
      loadDashboardData();
    }
  }, [user, isAdmin]);

  const loadDashboardData = async () => {
    setDataLoading(true);
    try {
      const p = await getProductsAction();
      const c = await getCategoriesAction();
      const o = await getOrdersAction();
      setProductsList(p);
      setCategoriesList(c);
      setOrdersList(o);
    } catch (e) {
      console.error("Failed to load admin data", e);
    } finally {
      setDataLoading(false);
    }
  };

  // Guard Redirection
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      // Allow some delay or directly redirect if not authorized
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-light flex items-center justify-center">
        <div className="text-primary font-bold animate-pulse text-xs">Authenticating Admin...</div>
      </div>
    );
  }

  // Not Authorized Shield Card
  if (!user || user.role !== "admin") {
    return (
      <>
        <Header />
        <main className="flex-grow py-20 px-4 bg-cream-light flex items-center justify-center text-[#2C2520]">
          <div className="max-w-md w-full bg-theme-white border border-[#D9534F]/30 p-8 rounded-2xl shadow-md text-center space-y-6">
            <div className="inline-block p-4 bg-[#D9534F]/10 text-[#D9534F] rounded-full">
              <ShieldAlert size={48} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold font-serif text-primary">Unauthorized Access</h1>
              <p className="text-xs text-[#8C7A6B] leading-relaxed">
                This dashboard requires administrator credentials. Normal customer logins cannot access database write privileges.
              </p>
            </div>
            <Link 
              href="/login" 
              className="inline-flex items-center gap-1 bg-primary text-cream-light font-bold text-xs py-2.5 px-6 rounded-full hover:bg-primary-light transition-all"
            >
              <span>Login as Admin</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Weight rows triggers
  const handleAddWeightRow = () => {
    setProductForm(prev => ({
      ...prev,
      weightOptions: [...prev.weightOptions, { weight: "", price: 0 }]
    }));
  };

  const handleRemoveWeightRow = (idx) => {
    setProductForm(prev => ({
      ...prev,
      weightOptions: prev.weightOptions.filter((_, i) => i !== idx)
    }));
  };

  const handleWeightRowChange = (idx, field, value) => {
    setProductForm(prev => {
      const updated = [...prev.weightOptions];
      updated[idx] = { 
        ...updated[idx], 
        [field]: field === "price" ? Number(value) : value 
      };
      return { ...prev, weightOptions: updated };
    });
  };

  // Submit Product Add/Edit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formattedProduct = {
      ...productForm,
      price: Number(productForm.price),
      ingredients: productForm.ingredients.split(",").map(i => i.trim()),
      benefits: productForm.benefits.split(",").map(i => i.trim()),
      images: productForm.images.split(",").map(i => i.trim()),
      slug: productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    };

    if (editingProductId) {
      const res = await updateProductAction(editingProductId, formattedProduct);
      if (res.success) {
        alert("Product updated successfully!");
        setEditingProductId(null);
      } else {
        alert(res.error || "Failed to update product.");
      }
    } else {
      const res = await addProductAction(formattedProduct);
      if (res.success) {
        alert("Product added successfully!");
      } else {
        alert(res.error || "Failed to add product.");
      }
    }

    setIsProductFormOpen(false);
    loadDashboardData();
    resetProductForm();
  };

  const handleEditProductClick = (p) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      category: p.category,
      price: p.price.toString(),
      description: p.description,
      longDescription: p.longDescription,
      ingredients: p.ingredients.join(", "),
      benefits: p.benefits.join(", "),
      images: p.images.join(", "),
      video: p.video || "https://www.w3schools.com/html/mov_bbb.mp4",
      origin: p.origin,
      farmer: p.farmer || "",
      farmerImage: p.farmerImage || "",
      farmerStory: p.farmerStory || "",
      inStock: p.inStock,
      isFeatured: p.isFeatured || false,
      weightOptions: p.weightOptions || [{ weight: "250g", price: p.price }]
    });
    setIsProductFormOpen(true);
  };

  const handleDeleteProductClick = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const res = await deleteProductAction(id);
      if (res.success) {
        alert("Product deleted!");
        loadDashboardData();
      } else {
        alert(res.error || "Failed to delete.");
      }
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      category: "Jaggery",
      price: "",
      description: "",
      longDescription: "",
      ingredients: "",
      benefits: "",
      images: "",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      origin: "",
      farmer: "",
      farmerImage: "",
      farmerStory: "",
      inStock: true,
      isFeatured: false,
      weightOptions: [{ weight: "250g", price: 150 }]
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit Category
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const res = await addCategoryAction(categoryForm);
    if (res.success) {
      alert("Category added successfully!");
      setCategoryForm({ name: "", slug: "", image: "" });
      setIsCategoryFormOpen(false);
      loadDashboardData();
    } else {
      alert(res.error || "Failed to add category.");
    }
  };

  // Submit Order Status update
  const handleOrderUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    
    const res = await updateOrderStatusAction(selectedOrder.id, orderUpdateStatus, orderTrackingId);
    if (res.success) {
      alert("Order status updated successfully!");
      setSelectedOrder(null);
      loadDashboardData();
    } else {
      alert("Failed to update status.");
    }
  };

  const filteredProducts = productsList.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.origin.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Stats
  const totalSales = ordersList
    .filter(o => o.status === "Delivered")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = ordersList.filter(o => o.status === "Pending").length;

  return (
    <>
      <Header />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-cream-light text-[#2C2520]">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-theme-white p-6 rounded-2xl border border-cream-medium shadow-sm">
            <div>
              <h1 className="text-3xl font-bold font-serif text-primary">Admin Control Dashboard</h1>
              <p className="text-xs text-[#8C7A6B] mt-0.5">Welcome, {user.name} | gaonse.com secure backend manager</p>
            </div>
            <button 
              onClick={loadDashboardData}
              className="bg-cream-medium text-primary hover:bg-cream-dark text-xs font-bold py-2 px-4 rounded-full transition-all cursor-pointer"
            >
              Refresh Database
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-theme-white p-5 rounded-2xl border border-cream-medium shadow-sm flex items-center gap-4">
              <span className="p-3 bg-secondary/15 text-primary rounded-xl shrink-0"><DollarSign size={22} /></span>
              <div>
                <span className="text-[10px] text-[#8C7A6B] block uppercase tracking-wider">Delivered Sales</span>
                <span className="text-base font-extrabold text-primary">₹{totalSales}</span>
              </div>
            </div>

            <div className="bg-theme-white p-5 rounded-2xl border border-cream-medium shadow-sm flex items-center gap-4">
              <span className="p-3 bg-[#E76F51]/15 text-[#E76F51] rounded-xl shrink-0"><ShoppingCart size={22} /></span>
              <div>
                <span className="text-[10px] text-[#8C7A6B] block uppercase tracking-wider">Pending Orders</span>
                <span className="text-base font-extrabold text-primary">{pendingOrdersCount}</span>
              </div>
            </div>

            <div className="bg-theme-white p-5 rounded-2xl border border-cream-medium shadow-sm flex items-center gap-4">
              <span className="p-3 bg-accent/15 text-accent rounded-xl shrink-0"><Package size={22} /></span>
              <div>
                <span className="text-[10px] text-[#8C7A6B] block uppercase tracking-wider">Products Catalog</span>
                <span className="text-base font-extrabold text-primary">{productsList.length} Items</span>
              </div>
            </div>

            <div className="bg-theme-white p-5 rounded-2xl border border-cream-medium shadow-sm flex items-center gap-4">
              <span className="p-3 bg-primary/15 text-primary rounded-xl shrink-0"><Layers size={22} /></span>
              <div>
                <span className="text-[10px] text-[#8C7A6B] block uppercase tracking-wider">Categories</span>
                <span className="text-base font-extrabold text-primary">{categoriesList.length} Tables</span>
              </div>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-cream-medium gap-6 bg-theme-white px-6 rounded-xl border border-cream-medium/70 shadow-sm">
            {[
              { id: "products", name: "Products Catalog" },
              { id: "categories", name: "Categories" },
              { id: "orders", name: `Orders Manager (${ordersList.length})` }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`py-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                  activeTab === t.id ? "text-primary border-b-2 border-secondary font-bold" : "text-[#8C7A6B] hover:text-primary"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="space-y-6">
            
            {dataLoading ? (
              <div className="text-center py-20 bg-theme-white rounded-2xl border border-cream-medium text-xs font-semibold text-[#8C7A6B] animate-pulse">
                Querying database files...
              </div>
            ) : (
              <>
                
                {/* 1. Products Manager Tab */}
                {activeTab === "products" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-theme-white p-4 rounded-xl border border-cream-medium shadow-sm">
                      <div className="relative w-full sm:w-80">
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="w-full bg-cream-light/60 border border-cream-medium rounded-full py-2 pl-4 pr-10 text-xs focus:outline-none focus:border-secondary"
                        />
                        <Search className="absolute right-3.5 top-2.5 text-[#8C7A6B]" size={15} />
                      </div>

                      <button
                        onClick={() => {
                          resetProductForm();
                          setEditingProductId(null);
                          setIsProductFormOpen(true);
                        }}
                        className="bg-primary hover:bg-primary-light text-cream-light font-bold text-xs py-2.5 px-5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-sm w-full sm:w-auto justify-center"
                      >
                        <Plus size={14} />
                        <span>Add New Product</span>
                      </button>
                    </div>

                    {/* Product Form Slider / Section */}
                    {isProductFormOpen && (
                      <div className="bg-theme-white p-6 rounded-2xl border border-cream-medium shadow-md space-y-6">
                        <div className="flex justify-between items-center pb-2 border-b border-cream-light">
                          <h3 className="text-md font-bold text-primary font-serif">
                            {editingProductId ? "Edit Sourced Product" : "Create Sourced Product"}
                          </h3>
                          <button onClick={() => setIsProductFormOpen(false)} className="text-[#8C7A6B] hover:text-[#D9534F] p-1">
                            <X size={20} />
                          </button>
                        </div>

                        <form onSubmit={handleProductSubmit} className="space-y-4">
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-primary font-serif">Product Title</label>
                              <input
                                type="text"
                                required
                                name="name"
                                value={productForm.name}
                                onChange={handleInputChange}
                                className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-primary font-serif">Category</label>
                              <select
                                name="category"
                                value={productForm.category}
                                onChange={handleInputChange}
                                className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2 text-xs"
                              >
                                {categoriesList.map(c => (
                                  <option key={c.name} value={c.name}>{c.name}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-primary font-serif">Base Price (₹)</label>
                              <input
                                type="number"
                                required
                                name="price"
                                value={productForm.price}
                                onChange={handleInputChange}
                                className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2 text-xs"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-primary font-serif">Short Description</label>
                              <input
                                type="text"
                                required
                                name="description"
                                value={productForm.description}
                                onChange={handleInputChange}
                                className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-primary font-serif">Origin Sourced Location</label>
                              <input
                                type="text"
                                required
                                name="origin"
                                placeholder="e.g. Varanasi, Uttar Pradesh"
                                value={productForm.origin}
                                onChange={handleInputChange}
                                className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2 text-xs"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-primary font-serif">Long Description (Storytelling details)</label>
                            <textarea
                              name="longDescription"
                              required
                              rows="3"
                              value={productForm.longDescription}
                              onChange={handleInputChange}
                              className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2 text-xs"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-primary font-serif">Ingredients (comma-separated)</label>
                              <input
                                type="text"
                                name="ingredients"
                                placeholder="Sugarcane, Ginger, Nutmeg"
                                value={productForm.ingredients}
                                onChange={handleInputChange}
                                className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-primary font-serif">Health Benefits (comma-separated)</label>
                              <input
                                type="text"
                                name="benefits"
                                placeholder="Improves digestion, Vitamin C rich"
                                value={productForm.benefits}
                                onChange={handleInputChange}
                                className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2 text-xs"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-primary font-serif">Images URLs (comma-separated Unsplash links)</label>
                              <input
                                type="text"
                                name="images"
                                required
                                placeholder="https://images.unsplash.com/..."
                                value={productForm.images}
                                onChange={handleInputChange}
                                className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-primary font-serif">Video Link (placeholder MP4)</label>
                              <input
                                type="text"
                                name="video"
                                value={productForm.video}
                                onChange={handleInputChange}
                                className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2 text-xs"
                              />
                            </div>
                          </div>

                          {/* Sourcing Farmer Details */}
                          <div className="bg-cream-light/45 p-4 rounded-xl border border-cream-medium space-y-4">
                            <h4 className="text-xs font-bold text-primary font-serif border-b border-cream-medium/40 pb-1">Farmer Details</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-primary font-serif">Farmer Name</label>
                                <input
                                  type="text"
                                  name="farmer"
                                  placeholder="Shri Ram Swaroop"
                                  value={productForm.farmer}
                                  onChange={handleInputChange}
                                  className="w-full bg-theme-white border border-cream-medium rounded-lg p-2 text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-primary font-serif">Farmer Portrait URL</label>
                                <input
                                  type="text"
                                  name="farmerImage"
                                  placeholder="https://images.unsplash.com/..."
                                  value={productForm.farmerImage}
                                  onChange={handleInputChange}
                                  className="w-full bg-theme-white border border-cream-medium rounded-lg p-2 text-xs"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-primary font-serif">Farmer Story (1-2 sentences)</label>
                              <input
                                type="text"
                                name="farmerStory"
                                placeholder="Grows crops organically for three generations..."
                                value={productForm.farmerStory}
                                onChange={handleInputChange}
                                className="w-full bg-theme-white border border-cream-medium rounded-lg p-2 text-xs"
                              />
                            </div>
                          </div>

                          {/* Dynamic Weight Tiers List */}
                          <div className="bg-cream-light/45 p-4 rounded-xl border border-cream-medium space-y-4">
                            <div className="flex justify-between items-center border-b border-cream-medium/40 pb-1">
                              <h4 className="text-xs font-bold text-primary font-serif">Weight Options & Pricing</h4>
                              <button
                                type="button"
                                onClick={handleAddWeightRow}
                                className="text-[10px] font-bold text-secondary flex items-center gap-0.5"
                              >
                                <Plus size={12} />
                                <span>Add Weight</span>
                              </button>
                            </div>

                            <div className="space-y-2">
                              {productForm.weightOptions.map((row, idx) => (
                                <div key={idx} className="flex gap-4 items-center">
                                  <input
                                    type="text"
                                    placeholder="e.g. 500g, 1L"
                                    required
                                    value={row.weight}
                                    onChange={(e) => handleWeightRowChange(idx, "weight", e.target.value)}
                                    className="bg-theme-white border border-cream-medium rounded-lg p-2 text-xs flex-1"
                                  />
                                  <input
                                    type="number"
                                    placeholder="Price in ₹"
                                    required
                                    value={row.price || ""}
                                    onChange={(e) => handleWeightRowChange(idx, "price", e.target.value)}
                                    className="bg-theme-white border border-cream-medium rounded-lg p-2 text-xs flex-1"
                                  />
                                  {productForm.weightOptions.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveWeightRow(idx)}
                                      className="text-[#D9534F] hover:bg-cream-medium p-1.5 rounded-full"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <label className="flex items-center gap-1.5 text-xs text-primary font-serif font-bold">
                              <input
                                type="checkbox"
                                name="inStock"
                                checked={productForm.inStock}
                                onChange={(e) => setProductForm(prev => ({ ...prev, inStock: e.target.checked }))}
                              />
                              <span>In Stock</span>
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-primary font-serif font-bold">
                              <input
                                type="checkbox"
                                name="isFeatured"
                                checked={productForm.isFeatured}
                                onChange={(e) => setProductForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                              />
                              <span>Feature on Home</span>
                            </label>
                          </div>

                          <div className="flex gap-3">
                            <button
                              type="submit"
                              className="bg-primary text-cream-light font-bold text-xs py-2 px-6 rounded-full hover:bg-primary-light"
                            >
                              {editingProductId ? "Update Product" : "Save Product"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                resetProductForm();
                                setEditingProductId(null);
                                setIsProductFormOpen(false);
                              }}
                              className="bg-cream-medium text-primary border border-cream-dark font-bold text-xs py-2 px-6 rounded-full hover:bg-cream-dark"
                            >
                              Cancel
                            </button>
                          </div>

                        </form>
                      </div>
                    )}

                    {/* Products Catalog Table */}
                    <div className="bg-theme-white rounded-xl border border-cream-medium shadow-sm overflow-hidden overflow-x-auto">
                      <table className="w-full border-collapse text-xs text-left">
                        <thead className="bg-cream-medium/40 border-b border-cream-medium text-[10px] font-bold text-[#8C7A6B] uppercase tracking-wider">
                          <tr>
                            <th className="p-4">Photo</th>
                            <th className="p-4">Title</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Base Price</th>
                            <th className="p-4">Stock Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-cream-light font-sans text-[#5C5043]">
                          {filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-cream-light/35 transition-colors">
                              <td className="p-4">
                                <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-md border border-cream-medium" />
                              </td>
                              <td className="p-4 font-bold text-primary font-serif">
                                <p>{p.name}</p>
                                <span className="text-[9px] text-[#8C7A6B] font-sans font-semibold">Origin: {p.origin.split(",")[0]}</span>
                              </td>
                              <td className="p-4 font-semibold">{p.category}</td>
                              <td className="p-4 font-bold">₹{p.price}</td>
                              <td className="p-4 font-semibold">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  p.inStock ? "bg-accent/15 text-accent border border-accent/25" : "bg-[#D9534F]/15 text-[#D9534F] border border-[#D9534F]/25"
                                }`}>
                                  {p.inStock ? "In Stock" : "Out of Stock"}
                                </span>
                              </td>
                              <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                <button 
                                  onClick={() => handleEditProductClick(p)}
                                  className="p-1 bg-cream-medium text-primary border border-cream-dark rounded hover:bg-cream-dark inline-block cursor-pointer"
                                  aria-label="Edit"
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProductClick(p.id)}
                                  className="p-1 bg-cream-medium text-[#D9534F] border border-[#D9534F]/20 rounded hover:bg-[#D9534F]/10 inline-block cursor-pointer"
                                  aria-label="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>
                )}

                {/* 2. Categories Tab */}
                {activeTab === "categories" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Add Category Form */}
                    <div className="bg-theme-white p-6 rounded-2xl border border-cream-medium shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-primary font-serif border-b border-cream-light pb-2">Add New Category</h3>
                      <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-primary font-serif">Category Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Traditional Oils"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm({ 
                              ...categoryForm, 
                              name: e.target.value,
                              slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
                            })}
                            className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2.5 text-xs"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-primary font-serif">Category Slug (Auto)</label>
                          <input
                            type="text"
                            required
                            disabled
                            value={categoryForm.slug}
                            className="w-full bg-cream-medium border border-cream-medium rounded-lg p-2.5 text-xs font-semibold text-[#8C7A6B]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-primary font-serif">Cover Image URL</label>
                          <input
                            type="text"
                            required
                            placeholder="https://images.unsplash.com/..."
                            value={categoryForm.image}
                            onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                            className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2.5 text-xs"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary-light text-cream-light font-bold text-xs py-3 rounded-full cursor-pointer"
                        >
                          Save Category
                        </button>
                      </form>
                    </div>

                    {/* Categories grid list */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {categoriesList.map((cat) => (
                        <div 
                          key={cat.slug} 
                          className="bg-theme-white p-4 rounded-xl border border-cream-medium shadow-sm flex gap-4 items-center"
                        >
                          <img src={cat.image} alt="" className="w-16 h-16 object-cover rounded-full border border-cream-medium shrink-0" />
                          <div>
                            <h4 className="font-bold text-primary font-serif text-sm">{cat.name}</h4>
                            <p className="text-[10px] text-[#8C7A6B] font-mono">Slug: {cat.slug}</p>
                            <span className="inline-block mt-2 bg-cream-medium px-2.5 py-0.5 rounded-full text-[9px] font-bold text-primary font-sans">
                              {cat.count} Products Sourced
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* 3. Orders Tab */}
                {activeTab === "orders" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Orders listing table */}
                    <div className="lg:col-span-2 bg-theme-white rounded-xl border border-cream-medium shadow-sm overflow-hidden overflow-x-auto">
                      <table className="w-full border-collapse text-xs text-left">
                        <thead className="bg-cream-medium/40 border-b border-cream-medium text-[10px] font-bold text-[#8C7A6B] uppercase tracking-wider">
                          <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Customer Email</th>
                            <th className="p-4">Total Price</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-cream-light font-sans text-[#5C5043]">
                          {ordersList.map((o) => (
                            <tr key={o.id} className="hover:bg-cream-light/35 transition-colors">
                              <td className="p-4 font-bold text-primary font-mono">{o.id}</td>
                              <td className="p-4 font-medium">{o.date}</td>
                              <td className="p-4 truncate max-w-[120px]">{o.shippingDetails.email}</td>
                              <td className="p-4 font-bold text-[#2C2520]">₹{o.total}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                                  o.status === "Delivered"
                                    ? "bg-accent/15 text-accent border border-accent/25"
                                    : o.status === "Dispatched"
                                      ? "bg-secondary/15 text-[#8C6239] border border-secondary/25"
                                      : "bg-[#D6A15F]/15 text-[#7A4E2D] border border-[#D6A15F]/25"
                                }`}>
                                  {o.status}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button 
                                  onClick={() => {
                                    setSelectedOrder(o);
                                    setOrderUpdateStatus(o.status);
                                    setOrderTrackingId(o.trackingId || "");
                                  }}
                                  className="text-[10px] font-extrabold text-primary hover:text-secondary underline cursor-pointer"
                                >
                                  Fulfill Info
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Order Details and Status Modifier Panel */}
                    {selectedOrder ? (
                      <div className="bg-theme-white p-6 rounded-2xl border border-cream-medium shadow-md space-y-4">
                        <div className="flex justify-between items-center border-b border-cream-light pb-2">
                          <h3 className="text-xs font-bold text-primary font-serif uppercase tracking-wider">Fulfill Order details</h3>
                          <button onClick={() => setSelectedOrder(null)} className="text-[#8C7A6B] hover:text-[#D9534F] text-xs">Close</button>
                        </div>

                        {/* Invoice fields */}
                        <div className="space-y-3 text-xs text-[#5C5043]">
                          <p>Order ID: <strong className="font-mono text-primary">{selectedOrder.id}</strong></p>
                          <p>Customer Name: <strong>{selectedOrder.shippingDetails.name}</strong></p>
                          <p>Address: {selectedOrder.shippingDetails.address}, {selectedOrder.shippingDetails.city}, {selectedOrder.shippingDetails.state} - {selectedOrder.shippingDetails.zip}</p>
                          <p>Phone: {selectedOrder.shippingDetails.phone}</p>
                          
                          <div className="bg-cream-light/45 p-3 rounded-lg border border-cream-medium">
                            <p className="font-bold text-primary font-serif mb-1">Basket Items</p>
                            <ul className="space-y-1 divide-y divide-cream-light text-[11px]">
                              {selectedOrder.cart.map((item, idx) => (
                                <li key={idx} className="pt-1 flex justify-between">
                                  <span>{item.product.name} ({item.selectedWeight.weight} x {item.quantity})</span>
                                  <span className="font-bold">₹{item.selectedWeight.price * item.quantity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <p className="font-bold text-right pt-1 text-primary text-sm">
                            Grand Total: ₹{selectedOrder.total}
                          </p>
                        </div>

                        {/* Status update form */}
                        <form onSubmit={handleOrderUpdateSubmit} className="space-y-4 pt-3 border-t border-cream-light">
                          <h4 className="text-[10px] font-bold text-primary font-serif uppercase tracking-wider">Modify Sourcing Status</h4>
                          
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#8C7A6B]">Courier Status</label>
                            <select
                              value={orderUpdateStatus}
                              onChange={(e) => setOrderUpdateStatus(e.target.value)}
                              className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2.5 text-xs text-primary font-semibold"
                            >
                              <option value="Pending">Pending (Processing)</option>
                              <option value="Dispatched">Dispatched (Shipped)</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>

                          {(orderUpdateStatus === "Dispatched" || orderUpdateStatus === "Delivered") && (
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-[#8C7A6B]">Delhivery Tracking ID</label>
                              <input
                                type="text"
                                placeholder="e.g. DL-839482938"
                                value={orderTrackingId}
                                onChange={(e) => setOrderTrackingId(e.target.value)}
                                className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2.5 text-xs text-primary font-semibold"
                              />
                            </div>
                          )}

                          <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary-light text-cream-light font-bold text-xs py-3 rounded-full cursor-pointer flex justify-center items-center gap-1 shadow-sm"
                          >
                            <Check size={14} />
                            <span>Save Fulfillment Info</span>
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="bg-cream-medium/25 border border-cream-medium rounded-2xl p-6 text-center text-xs text-[#8C7A6B]">
                        Click "Fulfill Info" next to any order to view purchase details, print billing details, or configure package tracking coordinates.
                      </div>
                    )}

                  </div>
                )}

              </>
            )}

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
