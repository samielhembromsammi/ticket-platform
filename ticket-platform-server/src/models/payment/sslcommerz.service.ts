import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const store_id = process.env.SSL_STORE_ID || "testbox";
const store_passwd = process.env.SSL_STORE_PASSWORD || "testbox";
const is_live = process.env.SSL_IS_LIVE === "true";

const SSL_BASE_URL = is_live 
  ? "https://securepay.sslcommerz.com" 
  : "https://sandbox.sslcommerz.com";

export const SSLCommerzService = {
  initPayment: async (data: {
    total_amount: number;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    cus_name: string;
    cus_email: string;
    cus_phone: string;
    product_name: string;
    product_category: string;
  }) => {
    try {
      const formData = new URLSearchParams();
      formData.append("store_id", store_id);
      formData.append("store_passwd", store_passwd);
      formData.append("total_amount", data.total_amount.toString());
      formData.append("currency", "BDT");
      formData.append("tran_id", data.tran_id);
      formData.append("success_url", data.success_url);
      formData.append("fail_url", data.fail_url);
      formData.append("cancel_url", data.cancel_url);
      formData.append("ipn_url", process.env.SSL_IPN_URL || "");
      formData.append("shipping_method", "NO");
      formData.append("product_name", data.product_name);
      formData.append("product_category", data.product_category);
      formData.append("product_profile", "general");
      formData.append("cus_name", data.cus_name);
      formData.append("cus_email", data.cus_email);
      formData.append("cus_add1", "Dhaka");
      formData.append("cus_city", "Dhaka");
      formData.append("cus_postcode", "1000");
      formData.append("cus_country", "Bangladesh");
      formData.append("cus_phone", data.cus_phone);

      const response = await axios.post(`${SSL_BASE_URL}/gwprocess/v4/api.php`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      if (response.data?.status !== "SUCCESS") {
        console.error("SSLCommerz API Error:", response.data);
      }

      return response.data;
    } catch (error: any) {
      console.error("SSLCommerz Connection Error:", error.message);
      return { status: "FAILED", failedreason: error.message };
    }
  },

  validatePayment: async (val_id: string) => {
    try {
      const response = await axios.get(
        `${SSL_BASE_URL}/validator/api/validationserverphp.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&v=1&format=json`
      );
      return response.data;
    } catch (error: any) {
      console.error("SSLCommerz Validation Error:", error.message);
      return { status: "FAILED", failedreason: error.message };
    }
  },
};
