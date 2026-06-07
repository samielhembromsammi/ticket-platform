const axios = require("axios");

const store_id = "nextd68084fc0c73cd";
const store_passwd = "nextd68084fc0c73cd@ssl";
const SSL_BASE_URL = "https://sandbox.sslcommerz.com";

const testInit = async () => {
  const formData = new URLSearchParams();
  formData.append("store_id", store_id);
  formData.append("store_passwd", store_passwd);
  formData.append("total_amount", "100");
  formData.append("currency", "BDT");
  formData.append("tran_id", "TEST_" + Date.now());
  formData.append("success_url", "http://localhost:5000/success");
  formData.append("fail_url", "http://localhost:5000/fail");
  formData.append("cancel_url", "http://localhost:5000/cancel");
  formData.append("ipn_url", "http://localhost:5000/ipn");
  formData.append("shipping_method", "NO");
  formData.append("product_name", "Test");
  formData.append("product_category", "Test");
  formData.append("product_profile", "general");
  formData.append("cus_name", "Test User");
  formData.append("cus_email", "test@test.com");
  formData.append("cus_add1", "Dhaka");
  formData.append("cus_city", "Dhaka");
  formData.append("cus_postcode", "1000");
  formData.append("cus_country", "Bangladesh");
  formData.append("cus_phone", "01700000000");

  try {
    const response = await axios.post(`${SSL_BASE_URL}/gwprocess/v4/api.php`, formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

testInit();
