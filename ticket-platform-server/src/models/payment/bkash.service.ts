import axios from "axios";

interface BkashPaymentResponse {
  paymentID: string;
  createTime: string;
  orgLogo: string;
  orgName: string;
  transactionStatus: string;
  amount: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
  redirectURL: string;
}

const getBaseUrl = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return isProduction
    ? "https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout"
    : "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout";
};

const getHeaders = (token: string) => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    authorization: token,
    "x-app-key": process.env.BKASH_APP_KEY,
  };
};

const getToken = async (): Promise<string> => {
  const baseUrl = getBaseUrl();
  const response = await axios.post(
    `${baseUrl}/token/grant`,
    {
      app_key: process.env.BKASH_APP_KEY,
      app_secret: process.env.BKASH_APP_SECRET,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        username: process.env.BKASH_USERNAME,
        password: process.env.BKASH_PASSWORD,
      },
    }
  );

  if (response.data.errorCode) {
    throw new Error(`bKash Token Grant Failed: ${response.data.errorMessage} (Code: ${response.data.errorCode})`);
  }

  return response.data.id_token;
};

export const BkashService = {
  createPayment: async (amount: number, invoiceNumber: string, callbackURL: string): Promise<BkashPaymentResponse> => {
    const token = await getToken();
    const baseUrl = getBaseUrl();
    
    const response = await axios.post(
      `${baseUrl}/create`,
      {
        mode: "0011",
        payerReference: invoiceNumber,
        callbackURL,
        amount: amount.toString(),
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: invoiceNumber,
      },
      {
        headers: getHeaders(token),
      }
    );

    if (response.data.errorCode) {
      throw new Error(`bKash Create Payment Failed: ${response.data.errorMessage} (Code: ${response.data.errorCode})`);
    }

    return {
      paymentID: response.data.paymentID,
      createTime: response.data.createTime,
      orgLogo: response.data.orgLogo || "",
      orgName: response.data.orgName || "",
      transactionStatus: response.data.transactionStatus,
      amount: response.data.amount,
      currency: response.data.currency,
      intent: response.data.intent,
      merchantInvoiceNumber: response.data.merchantInvoiceNumber,
      redirectURL: response.data.bkashURL, // Map bkashURL to redirectURL
    };
  },

  executePayment: async (paymentID: string): Promise<{ trxID: string; status: string; amount: number }> => {
    const token = await getToken();
    const baseUrl = getBaseUrl();
    
    const response = await axios.post(
      `${baseUrl}/execute`,
      { paymentID },
      {
        headers: getHeaders(token),
      }
    );

    if (response.data.errorCode) {
      throw new Error(`bKash Execute Payment Failed: ${response.data.errorMessage} (Code: ${response.data.errorCode})`);
    }

    return {
      trxID: response.data.trxID,
      status: response.data.transactionStatus,
      amount: parseFloat(response.data.amount),
    };
  },
};
