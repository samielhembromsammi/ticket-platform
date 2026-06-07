const SSLCommerzPayment = require("sslcommerz-lts");

const store_id = "nextd68084fc0c73cd";
const store_passwd = "nextd68084fc0c73cd@ssl";
const is_live = false;

const paymentData = {
  total_amount: 100,
  currency: "BDT",
  tran_id: "TEST_" + Date.now(),
  success_url: "http://localhost:5000/success",
  fail_url: "http://localhost:5000/fail",
  cancel_url: "http://localhost:5000/cancel",
  ipn_url: "http://localhost:5000/ipn",
  shipping_method: "NO",
  product_name: "Test",
  product_category: "Test",
  product_profile: "general",
  cus_name: "Test User",
  cus_email: "test@test.com",
  cus_add1: "Dhaka",
  cus_city: "Dhaka",
  cus_postcode: "1000",
  cus_country: "Bangladesh",
  cus_phone: "01859011700",
};

const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
sslcz.init(paymentData).then((response) => {
  console.log("Response:", response);
}).catch((err) => {
  console.error("Error:", err);
});
