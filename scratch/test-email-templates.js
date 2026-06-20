const { sendOrderReceiptEmail, sendOrderStatusUpdateEmail } = require("../src/lib/email.js");

// Mock process.env
process.env.SMTP_HOST = "smtp-relay.brevo.com";
process.env.SMTP_PORT = "587";
process.env.SMTP_USER = "af6df1001@smtp-brevo.com";
process.env.SMTP_PASS = "FYGzj6VJa07mvbDs";
process.env.SMTP_FROM = "GaonSe <no-reply@gaonse.com>";

const mockUPOrder = {
  id: "GS-839482",
  date: "2026-06-20",
  status: "Pending",
  trackingId: "",
  cart: [
    {
      product: { name: "Organic Jaggery (Gur)" },
      selectedWeight: { weight: "500g", price: 150 },
      quantity: 2
    },
    {
      product: { name: "Handcrafted Mustard Oil" },
      selectedWeight: { weight: "1L", price: 280 },
      quantity: 1
    }
  ],
  shippingDetails: {
    name: "Aarav Sharma",
    email: "aarav@gmail.com",
    phone: "9876543210",
    address: "12, Kabir Nagar",
    city: "Varanasi",
    state: "Uttar Pradesh",
    zip: "221005"
  },
  subtotal: 580,
  discount: 50,
  delivery: 0,
  gst: 29, // 5% of (580 - 50) = 26.5 rounded
  total: 559
};

const mockDelhiOrder = {
  id: "GS-482938",
  date: "2026-06-20",
  status: "Dispatched",
  trackingId: "DL-839482938",
  cart: [
    {
      product: { name: "A2 Bansi Wheat Flour" },
      selectedWeight: { weight: "5kg", price: 450 },
      quantity: 1
    }
  ],
  shippingDetails: {
    name: "Priya Sen",
    email: "priya@gmail.com",
    phone: "9988776655",
    address: "Flat 4B, South Ext",
    city: "Delhi",
    state: "Delhi",
    zip: "110049"
  },
  subtotal: 450,
  discount: 0,
  delivery: 50,
  gst: 23,
  total: 523
};

async function runTests() {
  console.log("=========================================");
  console.log("RUNNING EMAIL INVOICE / NOTIFICATION TESTS");
  console.log("=========================================");

  // Test 1: Uttar Pradesh Order (CGST / SGST split)
  console.log("\n--- TEST 1: UP Order Receipt Email ---");
  console.log("Expected: CGST/SGST split, no-reply@gaonse.com sender");
  let res = await sendOrderReceiptEmail(mockUPOrder);
  console.log("Result:", res);

  // Test 2: Delhi Order (IGST)
  console.log("\n--- TEST 2: Delhi Order Receipt Email ---");
  console.log("Expected: IGST calculated, standard layout");
  res = await sendOrderReceiptEmail(mockDelhiOrder);
  console.log("Result:", res);

  // Test 3: Status Update - Dispatched (Logistics box)
  console.log("\n--- TEST 3: Status Update - Dispatched ---");
  console.log("Expected: Delhivery tracking ID and dispatch info");
  res = await sendOrderStatusUpdateEmail(mockDelhiOrder);
  console.log("Result:", res);

  // Test 4: Status Update - Delivered (Delivered banner)
  console.log("\n--- TEST 4: Status Update - Delivered ---");
  const deliveredOrder = { ...mockDelhiOrder, status: "Delivered" };
  res = await sendOrderStatusUpdateEmail(deliveredOrder);
  console.log("Result:", res);

  // Test 5: Sandbox Mode Fallback (no credentials)
  console.log("\n--- TEST 5: Sandbox Mode Fallback ---");
  console.log("Removing credentials...");
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_PORT;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;
  
  res = await sendOrderReceiptEmail(mockUPOrder);
  console.log("Result:", res);
}

runTests();
