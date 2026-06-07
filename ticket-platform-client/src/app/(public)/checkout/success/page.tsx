"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/src/services/api";
import { Button, message, Result } from "antd";
import { CheckCircle2, Ticket, ArrowRight } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    const paymentID = searchParams.get("paymentID") || searchParams.get("payment_ref_id");
    const status = searchParams.get("status");
    const methodFromUrl = searchParams.get("method") as "bkash" | "nagad" | "sslcommerz" | "stripe";

    if (!paymentID || (status !== "success" && status !== "Success")) {
      setVerifying(false);
      setSuccess(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        let method = methodFromUrl;
        if (!method) {
          method = searchParams.get("paymentID") ? "bkash" : "nagad";
        }

        const response = await api.post("/payments/verify", {
          paymentIntent: paymentID,
          method: method
        });

        if (response.data.success) {
          setSuccess(true);
          setTicketId(response.data.data.ticket);
        }
      } catch (error) {
        message.error("Payment verification failed");
        setSuccess(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);


  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <h2 className="text-xl font-bold text-gray-700">Verifying your payment...</h2>
        <p className="text-gray-500">Please do not refresh or close this page.</p>
      </div>
    );
  }

  if (!success) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-red-100 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-red-500 text-4xl font-bold">!</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-8">We couldn't verify your payment. If money was deducted, please contact support.</p>
        <Button
          type="primary"
          block
          size="large"
          onClick={() => router.push("/events")}
          className="bg-gray-900 h-12 rounded-xl"
        >
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-20 p-10 bg-white rounded-3xl shadow-2xl border border-green-50 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 className="w-12 h-12 text-green-600" />
      </div>

      <h1 className="text-4xl font-black text-gray-900 mb-4">Awesome!</h1>
      <p className="text-xl text-gray-600 mb-10">Your ticket has been booked successfully. Get ready for the event!</p>

      <div className="flex flex-col gap-4">
        <Button
          type="primary"
          block
          size="large"
          icon={<Ticket className="w-5 h-5 mr-2" />}
          onClick={() => router.push(`/ticket/${ticketId}`)}
          className="bg-blue-600 hover:bg-blue-500 h-16 text-lg font-bold rounded-2xl border-none shadow-lg shadow-blue-500/30 flex items-center justify-center"
        >
          View Your Ticket <ArrowRight className="ml-2 w-5 h-5" />
        </Button>

        <Button
          type="default"
          block
          size="large"
          onClick={() => router.push("/dashboard/tickets")}
          className="h-14 rounded-2xl border-gray-200 text-gray-600 font-medium"
        >
          Go to My Tickets
        </Button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
