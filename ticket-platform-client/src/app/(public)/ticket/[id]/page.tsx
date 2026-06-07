"use client";

import React, { use, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import api from "@/src/services/api";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";

export default function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await api.get(`/event-tickets/${id}`);
        setTicket(response.data.data);
      } catch (error) {
        console.error("Failed to load ticket details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const searchParams = useSearchParams();
  const shouldPrint = searchParams.get("print") === "true";

  useEffect(() => {
    if (ticket && shouldPrint) {
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [ticket, shouldPrint]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Loading your ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-bold text-xl">
        Ticket Not Found
      </div>
    );
  }

  const { event, user } = ticket;

  const ticketData = {
    issueDateTime: dayjs(ticket.createdAt).format("DD-MM-YYYY HH:mm"),
    journeyDateTime: dayjs(event.date).format("DD-MM-YYYY HH:mm"),
    trainNameNumber: event.title,
    fromStation: event.location, // Assuming location is the source
    toStation: "Event Venue",
    className: "PREMIUM_ENTRY",
    coachNameSeat: `SEC-${ticket.ticketNumber.slice(-4)}`,
    noOfSeats: ticket.quantity,
    noOfAdultPassengers: ticket.quantity,
    noOfChildPassengers: "0",
    fare: ticket.price.toFixed(2),
    vat: (ticket.vat || 0).toFixed(2),
    serviceCharge: (ticket.serviceCharge || 0).toFixed(2),
    totalFare: (ticket.totalFare || (ticket.price * ticket.quantity)).toFixed(2),
    passengerName: user.fullName,
    identificationType: "EMAIL",
    identificationNumber: user.email,
    mobileNumber: user.phoneNumber || "N/A",
    pnrNumber: ticket.pnrNumber || ticket.ticketNumber.slice(0, 10).toUpperCase(),
    coPassenger1: "NONE",
    qrCodeData: `${window.location.origin}/ticket/${ticket._id}`,
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10 pt-32 flex flex-col justify-center items-center p-4">
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; margin: 0 !important; }
          .min-h-screen { background: white !important; padding: 0 !important; min-height: auto !important; }
          .shadow-xl { shadow: none !important; border: 2px solid #16a34a !important; }
        }
      `}</style>
      <div
        id="ticket-container"
        className="bg-white w-[794px] min-h-[1123px] mx-auto border-2 border-green-600 p-8 text-sm font-sans shadow-xl relative"
      >
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden border border-gray-100">
              <span className="text-white font-black text-xl">TP</span>
            </div>
          </div>

          <div className="text-center flex-grow">
            <h1 className="text-2xl font-bold text-blue-600 tracking-wide uppercase">Ticket Platform</h1>
            <h2 className="text-xl font-bold text-blue-500">টিকেট প্ল্যাটফর্ম</h2>
          </div>

          <div className="flex flex-col items-end gap-2 text-right">
            <div className="text-xs">
              <span className="block text-gray-400">Powered by</span>
              <span className="text-green-600 font-bold block leading-tight">Ticket Platform</span>
            </div>
            <QRCodeSVG value={ticketData.qrCodeData} size={80} />
          </div>
        </div>

        {/* Greeting Section */}
        <div className="mb-6 text-gray-800 leading-relaxed text-xs">
          <p className="font-bold">Dear {ticketData.passengerName},</p>
          <p>
            Your request to book e-ticket for {event.title} was successful. You can attend the event mentioned in the ticket subject to showing your ID card or this e-ticket. The details of your e-ticket are as below:
          </p>
          <p className="mt-2 text-[10px] text-gray-600 italic">
            ইভেন্টে অংশগ্রহণের জন্য আপনার ই-টিকিট সফলভাবে প্রদান করা হয়েছে। আপনার পরিচয়পত্র কিংবা এই ই-টিকিট দেখানো সাপেক্ষে আপনি অংশগ্রহন করতে পারবেন।
          </p>
        </div>

        {/* Journey Information */}
        <div className="mb-8">
          <div className="bg-green-600 text-white font-bold py-2 px-3 flex items-center uppercase tracking-wider">
            Event Information (ইভেন্টের তথ্য)
          </div>
          <table className="w-full border-collapse border border-gray-300 text-xs">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 w-1/2 border-r border-gray-300 bg-gray-50">Issue Date & Time (প্রদানের তারিখ ও সময়)</td>
                <td className="py-2 px-3 w-1/2 font-semibold">{ticketData.issueDateTime}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 border-r border-gray-300 bg-gray-50">Event Date & Time (ইভেন্টের তারিখ ও সময়)</td>
                <td className="py-2 px-3 font-semibold">{ticketData.journeyDateTime}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 border-r border-gray-300 bg-gray-50">Event Name (ইভেন্টের নাম)</td>
                <td className="py-2 px-3 font-semibold text-blue-600 underline cursor-pointer">{ticketData.trainNameNumber}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 border-r border-gray-300 bg-gray-50">Location (স্থান)</td>
                <td className="py-2 px-3 font-semibold">{ticketData.fromStation}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 border-r border-gray-300 bg-gray-50">Status (অবস্থা)</td>
                <td className="py-2 px-3 font-bold text-green-600 uppercase">{ticket.status}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 border-r border-gray-300 bg-gray-50">Category (শ্রেণি)</td>
                <td className="py-2 px-3 font-semibold">{ticketData.className}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 border-r border-gray-300 bg-gray-50">Ticket ID / Section (টিকেট আইডি)</td>
                <td className="py-2 px-3 font-semibold font-mono">{ticketData.coachNameSeat}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 border-r border-gray-300 bg-gray-50">No. of Tickets (টিকেট সংখ্যা)</td>
                <td className="py-2 px-3 font-semibold">{ticketData.noOfSeats}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 border-r border-gray-300 bg-gray-50">Ticket Price (টিকিটের দাম)</td>
                <td className="py-2 px-3 font-semibold">BDT {ticketData.fare}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 border-r border-gray-300 bg-gray-50">VAT (ভ্যাট)</td>
                <td className="py-2 px-3 font-semibold">BDT {ticketData.vat}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 border-r border-gray-300 bg-gray-50">Service Charge (সেবা খরচ)</td>
                <td className="py-2 px-3 font-semibold">BDT {ticketData.serviceCharge}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 border-r border-gray-300 bg-gray-50 font-bold">Total Payable (মোট প্রদেয়)**</td>
                <td className="py-2 px-3 font-bold text-lg">BDT {ticketData.totalFare}</td>
              </tr>
              <tr>
                <td colSpan={2} className="py-2 px-3 text-[10px] text-gray-500 italic">
                  ** Total Payable includes service charges and applicable taxes.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Passenger Information */}
        <div className="mb-8">
          <div className="bg-green-600 text-white font-bold py-2 px-3 flex items-center uppercase tracking-wider">
            User Information (ব্যবহারকারীর তথ্য)
          </div>
          <table className="w-full border-collapse border border-gray-300 text-xs">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 w-1/2 border-r border-gray-300 bg-gray-50">Full Name (পুরো নাম)</td>
                <td className="py-2 px-3 w-1/2 font-bold uppercase">{ticketData.passengerName}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 border-r border-gray-300 bg-gray-50">Email Address (ইমেল ঠিকানা)</td>
                <td className="py-2 px-3 font-semibold">{ticketData.identificationNumber}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 border-r border-gray-300 bg-gray-50">Mobile Number (মোবাইল নম্বর)</td>
                <td className="py-2 px-3 font-semibold">{ticketData.mobileNumber}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 border-r border-gray-300 bg-gray-50">PNR / Transaction ID (পিএনআর নম্বর)</td>
                <td className="py-2 px-3 font-semibold font-mono">{ticketData.pnrNumber}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 border-r border-gray-300 bg-gray-50 font-bold">Payment Status</td>
                <td className={`py-2 px-3 font-black uppercase ${ticket.status === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>
                  {ticket.status}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Notes */}
        <div className="grid grid-cols-2 gap-8 text-xs text-gray-700">
          <div>
            <p className="font-bold mb-2 underline">Please Note:-</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Show this digital ticket at the entrance for verification.</li>
              <li>You can carry either a digital copy or a printed version.</li>
              <li>Ensure you arrive at least 15 minutes before the event starts.</li>
            </ul>

            <div className="mt-8">
              <p>Wishing you a pleasant experience-</p>
              <p className="font-bold text-sm text-blue-600">Ticket Platform Team</p>
            </div>
          </div>
          <div>
            <p className="font-bold mb-2 underline">খেয়াল করুন:-</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>প্রবেশপথে যাচাইয়ের জন্য এই ডিজিটাল টিকিটটি দেখান।</li>
              <li>আপনি ডিজিটাল কপি অথবা প্রিন্টেড কপি সাথে রাখতে পারেন।</li>
              <li>ইভেন্ট শুরুর কমপক্ষে ১৫ মিনিট আগে পৌঁছানো নিশ্চিত করুন।</li>
            </ul>

            <div className="mt-8">
              <p>আপনার সুন্দর অভিজ্ঞতার কামনায়-</p>
              <p className="font-bold text-sm text-blue-600">টিকেট প্ল্যাটফর্ম টিম</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
