"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/src/services/api";
import { Button, message, InputNumber, Divider, Radio, Space } from "antd";
import { CreditCard } from "lucide-react";
import { useAuthStore } from "@/src/store/authStore";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [event, setEvent] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "sslcommerz" | "stripe">("stripe");

  useEffect(() => {
    if (!isAuthenticated) {
      message.warning("Please login to purchase tickets");
      router.push("/auth/login");
      return;
    }

    if (!eventId) {
      router.push("/events");
      return;
    }

    api.get(`/events/${eventId}`)
      .then((res) => {
        const ev = res.data.data;
        if (!ev.isPremium) {
          message.info("Free events do not require tickets.");
          router.push(`/events/${eventId}`);
        } else {
          setEvent(ev);
        }
      })
      .catch(() => {
        message.error("Failed to load event details");
        router.push("/events");
      })
      .finally(() => setLoading(false));
  }, [eventId, isAuthenticated, router]);

  const handlePurchase = async () => {
    if (!user) {
      message.error("User session not found");
      return;
    }

    setPurchasing(true);
    try {
      const callbackURL = `${window.location.origin}/checkout/success`;

      const response = await api.post("/payments/create", {
        eventId,
        quantity,
        method: paymentMethod,
        callbackURL
      });

      const { redirectURL } = response.data.data;

      message.loading("Redirecting to payment gateway...", 2);

      // Redirect to the payment gateway
      setTimeout(() => {
        window.location.href = redirectURL;
      }, 500);

    } catch (error: any) {
      message.error(error.response?.data?.message || "Payment initiation failed");
      setPurchasing(false);
    }
  };


  if (loading) return <div className="flex justify-center p-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>;
  if (!event) return null;

  const maxAvailable = event.totalTickets - event.soldTickets;
  const totalPrice = event.price * quantity;

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-3xl font-extrabold mb-8 flex items-center">
        <CreditCard className="mr-3 w-8 h-8 text-blue-600" /> Checkout
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex items-center gap-4 mb-6">
            <img src={event.image} alt={event.title} className="w-24 h-24 object-cover rounded-xl" />
            <div>
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p className="text-gray-500 text-sm">{new Date(event.date).toLocaleDateString()}</p>
              <p className="text-gray-500 text-sm">{event.location}</p>
            </div>
          </div>

          <Divider />

          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-gray-700">Ticket Quantity</span>
            <InputNumber
              min={1}
              max={maxAvailable > 10 ? 10 : maxAvailable}
              value={quantity}
              onChange={(value) => setQuantity(value || 1)}
              size="large"
              className="w-32"
            />
          </div>
          <p className="text-xs text-gray-500 text-right mb-6">{maxAvailable} tickets left</p>

          <Divider />

          <h2 className="text-lg font-bold mb-4">Select Payment Method</h2>
          <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod} className="w-full">
            <Space orientation="vertical" className="w-full">
              <div
                className={`border p-4 rounded-xl cursor-pointer transition ${paymentMethod === 'sslcommerz' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setPaymentMethod('sslcommerz')}
              >
                <Radio value="sslcommerz">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-blue-600">SSLCommerz</span>
                    <span className="text-xs text-gray-500">Pay with Card, Mobile Banking or Net Banking</span>
                  </div>
                </Radio>
              </div>
              <div
                className={`border p-4 rounded-xl cursor-pointer transition ${paymentMethod === 'stripe' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                onClick={() => setPaymentMethod('stripe')}
              >
                <Radio value="stripe">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-indigo-600">Stripe (Card Payment)</span>
                    <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full">Recommended</span>
                    <span className="text-xs text-gray-500">Securely pay with any Credit or Debit Card</span>
                  </div>
                </Radio>
              </div>
              <div
                className={`border p-4 rounded-xl cursor-pointer transition ${paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
                onClick={() => setPaymentMethod('bkash')}
              >
                <Radio value="bkash">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-pink-600">bKash</span>
                    <span className="text-xs text-gray-500">Directly pay using bKash account</span>
                  </div>
                </Radio>
              </div>
              <div
                className={`border p-4 rounded-xl cursor-pointer transition ${paymentMethod === 'nagad' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                onClick={() => setPaymentMethod('nagad')}
              >
                <Radio value="nagad">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-orange-600">Nagad</span>
                    <span className="text-xs text-gray-500">Directly pay using Nagad account</span>
                  </div>
                </Radio>
              </div>
            </Space>
          </Radio.Group>

        </div>

        <div className="md:w-1/3 bg-gray-50 p-6 rounded-2xl border border-gray-200">
          <h2 className="text-xl font-bold mb-6">Payment Details</h2>

          <div className="flex justify-between mb-3 text-gray-600">
            <span>Price per ticket</span>
            <span>${event.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-3 text-gray-600">
            <span>Quantity</span>
            <span>x {quantity}</span>
          </div>

          <Divider />

          <div className="flex justify-between items-center mb-8">
            <span className="font-bold text-lg text-gray-900">Total</span>
            <span className="font-black text-2xl text-blue-600">${totalPrice.toFixed(2)}</span>
          </div>

          <Button
            type="primary"
            size="large"
            block
            loading={purchasing}
            onClick={handlePurchase}
            className="bg-blue-600 hover:bg-blue-500 h-14 text-lg font-bold rounded-xl border-none shadow-lg shadow-blue-500/30"
          >
            Confirm & Pay
          </Button>
          <p className="text-xs text-center text-gray-400 mt-4">
            By clicking "Confirm & Pay", you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
