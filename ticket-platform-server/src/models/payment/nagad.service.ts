import { NagadGateway } from "nagad-payment-gateway";

interface NagadCreateResponse {
  paymentRefId: string;
  orderId: string;
  status: string;
  redirectURL: string;
}

const formatPemKey = (key: string): string => {
  if (!key) return "";
  if (key.includes("\\n")) {
    return key.replace(/\\n/g, "\n");
  }
  return key;
};

const getGatewayInstance = (callbackURL?: string): NagadGateway => {
  const isProduction = process.env.NODE_ENV === "production";
  
  // Default sandbox and production base URLs for Nagad
  const baseURL = isProduction
    ? (process.env.NAGAD_BASE_URL || "https://api.mynagad.com/api")
    : (process.env.NAGAD_BASE_URL || "http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api");

  const fallbackCallback = process.env.NAGAD_CALLBACK_URL || `${process.env.CLIENT_URL || "http://localhost:3000"}/checkout/success`;

  const config = {
    apiVersion: "v-0.2.0",
    baseURL,
    callbackURL: callbackURL || fallbackCallback,
    merchantID: process.env.NAGAD_MERCHANT_ID || "",
    merchantNumber: process.env.NAGAD_MERCHANT_NUMBER || process.env.NAGAD_MERCHANT_ID || "",
    privKey: formatPemKey(process.env.NAGAD_PRIVATE_KEY || ""),
    pubKey: formatPemKey(process.env.NAGAD_PUBLIC_KEY || ""),
    isPath: false,
  };

  return new NagadGateway(config);
};

const getPaymentRefIdFromUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    const token = parsedUrl.searchParams.get("token");
    if (!token) {
      throw new Error("Token parameter not found in Nagad redirect URL");
    }
    return token;
  } catch (error) {
    const match = url.match(/[?&]token=([^&]+)/);
    if (match && match[1]) {
      return match[1];
    }
    throw new Error("Failed to parse payment token from Nagad URL");
  }
};

export const NagadService = {
  createPayment: async (amount: number, orderId: string, callbackURL: string): Promise<NagadCreateResponse> => {
    const nagad = getGatewayInstance(callbackURL);
    
    // IP address of client, defaulting to local loopback if not accessible
    const ipAddress = "127.0.0.1";

    const redirectURL = await nagad.createPayment({
      amount: amount.toString(),
      ip: ipAddress,
      orderId,
      productDetails: { name: "Ticket Purchase" },
      clientType: "PC_WEB",
    });

    const paymentRefId = getPaymentRefIdFromUrl(redirectURL);

    return {
      paymentRefId,
      orderId,
      status: "Success",
      redirectURL,
    };
  },

  verifyPayment: async (paymentRefId: string): Promise<{ trxId: string; status: string; amount: number }> => {
    const nagad = getGatewayInstance();
    const verificationResult = await nagad.verifyPayment(paymentRefId);

    const isSuccess = 
      verificationResult.status === "Success" || 
      verificationResult.statusCode === "000" || 
      verificationResult.statusCode === "00_000_000";

    if (!isSuccess) {
      throw new Error(`Nagad Payment Verification Failed with status: ${verificationResult.status} (code: ${verificationResult.statusCode})`);
    }

    return {
      trxId: verificationResult.issuerPaymentRefNo || verificationResult.paymentRefId,
      status: "Success",
      amount: parseFloat(verificationResult.amount),
    };
  },
};
