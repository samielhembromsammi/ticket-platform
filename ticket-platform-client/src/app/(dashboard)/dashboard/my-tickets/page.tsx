"use client";

import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Table, Tag, Space, Card, message, Button } from "antd";
import { Ticket as TicketIcon, Calendar } from "lucide-react";
import Link from "next/link";
import moment from "moment";
import jsPDF from "jspdf";
import QRCode from "qrcode";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await api.get("/event-tickets/my-tickets");
        setTickets(response.data.data || []);
      } catch (error) {
        console.error(error);
        message.error("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const downloadTicket = async (ticket: any) => {
    try {
      message.loading({ content: "Generating PDF...", key: "pdf-gen", duration: 0 });

      const event = ticket.event || {};
      const user = ticket.user || {};

      // Build ticket data
      const issueDateTime = moment(ticket.createdAt).format("DD-MM-YYYY HH:mm");
      const journeyDateTime = moment(event.date).format("DD-MM-YYYY HH:mm");
      const eventTitle = event.title || "N/A";
      const location = event.location || "N/A";
      const ticketStatus = (ticket.status || "N/A").toUpperCase();
      const category = "PREMIUM ENTRY";
      const ticketSection = `SEC-${(ticket.ticketNumber || "0000").slice(-4)}`;
      const numTickets = String(ticket.quantity || 1);
      const price = (ticket.price || 0).toFixed(2);
      const vat = (ticket.vat || 0).toFixed(2);
      const serviceCharge = (ticket.serviceCharge || 0).toFixed(2);
      const totalFare = (ticket.totalFare || (ticket.price * ticket.quantity) || 0).toFixed(2);
      const fullName = (user.fullName || "N/A").toUpperCase();
      const email = user.email || "N/A";
      const phone = user.phoneNumber || "N/A";
      const pnr = ticket.pnrNumber || (ticket.ticketNumber || "").slice(0, 10).toUpperCase();
      const paymentStatus = (ticket.status || "N/A").toUpperCase();

      // Generate QR code as data URL
      const qrUrl = `${window.location.origin}/ticket/${ticket._id}`;
      const qrDataUrl = await QRCode.toDataURL(qrUrl, { width: 200, margin: 1 });

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      // Colors
      const green = [22, 163, 74]; // green-600
      const blue = [37, 99, 235]; // blue-600
      const darkGray = [55, 65, 81];
      const lightGray = [107, 114, 128];
      const bgGray = [249, 250, 251];
      const borderGray = [209, 213, 219];

      // ── OUTER BORDER ──
      pdf.setDrawColor(green[0], green[1], green[2]);
      pdf.setLineWidth(0.8);
      pdf.rect(margin - 2, margin - 2, contentWidth + 4, 272);

      // ── HEADER ──
      // TP Circle
      pdf.setFillColor(blue[0], blue[1], blue[2]);
      pdf.circle(margin + 8, y + 8, 8, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("TP", margin + 8, y + 10, { align: "center" });

      // Title
      pdf.setTextColor(blue[0], blue[1], blue[2]);
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("TICKET PLATFORM", pageWidth / 2, y + 6, { align: "center" });

      // Powered by + QR code
      pdf.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.setFontSize(6);
      pdf.setFont("helvetica", "normal");
      pdf.text("Powered by", pageWidth - margin - 10, y, { align: "center" });
      pdf.setTextColor(green[0], green[1], green[2]);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      pdf.text("Ticket Platform", pageWidth - margin - 10, y + 4, { align: "center" });

      // QR Code
      pdf.addImage(qrDataUrl, "PNG", pageWidth - margin - 20, y + 6, 20, 20);

      y += 28;

      // Divider
      pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      pdf.setLineWidth(0.3);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 6;

      // ── GREETING ──
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Dear ${user.fullName || "Customer"},`, margin, y);
      y += 4;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      const greetingText = `Your request to book e-ticket for ${eventTitle} was successful. You can attend the event mentioned in the ticket subject to showing your ID card or this e-ticket. The details of your e-ticket are as below:`;
      const greetingLines = pdf.splitTextToSize(greetingText, contentWidth);
      pdf.text(greetingLines, margin, y);
      y += greetingLines.length * 3.5 + 4;

      // ── Helper: Draw a table section ──
      const drawTableSection = (title: string, rows: [string, string][], startY: number): number => {
        let curY = startY;

        // Section header (green bar)
        pdf.setFillColor(green[0], green[1], green[2]);
        pdf.rect(margin, curY, contentWidth, 7, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "bold");
        pdf.text(title, margin + 3, curY + 5);
        curY += 7;

        const rowHeight = 6;
        const col1Width = contentWidth / 2;
        const col2Width = contentWidth / 2;

        rows.forEach((row, idx) => {
          const isLast = idx === rows.length - 1;

          // Label cell bg
          pdf.setFillColor(bgGray[0], bgGray[1], bgGray[2]);
          pdf.rect(margin, curY, col1Width, rowHeight, "F");

          // Value cell bg
          pdf.setFillColor(255, 255, 255);
          pdf.rect(margin + col1Width, curY, col2Width, rowHeight, "F");

          // Cell borders
          pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
          pdf.setLineWidth(0.2);
          pdf.rect(margin, curY, col1Width, rowHeight, "S");
          pdf.rect(margin + col1Width, curY, col2Width, rowHeight, "S");

          // Label text
          pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
          pdf.setFontSize(7);

          // Check for bold label (Total Payable, Payment Status)
          if (row[0].includes("Total Payable") || row[0].includes("Payment Status")) {
            pdf.setFont("helvetica", "bold");
          } else {
            pdf.setFont("helvetica", "normal");
          }
          pdf.text(row[0], margin + 2, curY + 4);

          // Value text
          if (row[0].includes("Total Payable")) {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(9);
            pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
          } else if (row[0].includes("Status") || row[0].includes("Payment Status")) {
            pdf.setFont("helvetica", "bold");
            if (paymentStatus === "PAID") {
              pdf.setTextColor(green[0], green[1], green[2]);
            } else {
              pdf.setTextColor(234, 88, 12); // orange
            }
          } else if (row[0].includes("Event Name")) {
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(blue[0], blue[1], blue[2]);
          } else if (row[0].includes("Full Name")) {
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
          } else {
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
          }

          pdf.text(row[1], margin + col1Width + 2, curY + 4);
          curY += rowHeight;
        });

        return curY;
      };

      // ── EVENT INFORMATION TABLE ──
      const eventRows: [string, string][] = [
        ["Issue Date & Time", issueDateTime],
        ["Event Date & Time", journeyDateTime],
        ["Event Name", eventTitle],
        ["Location", location],
        ["Status", ticketStatus],
        ["Category", category],
        ["Ticket ID / Section", ticketSection],
        ["No. of Tickets", numTickets],
        ["Ticket Price", `BDT ${price}`],
        ["VAT", `BDT ${vat}`],
        ["Service Charge", `BDT ${serviceCharge}`],
        ["Total Payable**", `BDT ${totalFare}`],
      ];

      y = drawTableSection("EVENT INFORMATION", eventRows, y);

      // Footnote
      pdf.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.setFontSize(5.5);
      pdf.setFont("helvetica", "italic");
      pdf.text("** Total Payable includes service charges and applicable taxes.", margin + 2, y + 3);
      y += 8;

      // ── USER INFORMATION TABLE ──
      const userRows: [string, string][] = [
        ["Full Name", fullName],
        ["Email Address", email],
        ["Mobile Number", phone],
        ["PNR / Transaction ID", pnr],
        ["Payment Status", paymentStatus],
      ];

      y = drawTableSection("USER INFORMATION", userRows, y);
      y += 8;

      // ── FOOTER NOTES ──
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      pdf.text("Please Note:-", margin, y);
      y += 4;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(6.5);

      const notes = [
        "• Show this digital ticket at the entrance for verification.",
        "• You can carry either a digital copy or a printed version.",
        "• Ensure you arrive at least 15 minutes before the event starts.",
      ];
      notes.forEach((note) => {
        pdf.text(note, margin + 2, y);
        y += 3.5;
      });

      y += 4;
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.text("Wishing you a pleasant experience-", margin, y);
      y += 4;
      pdf.setTextColor(blue[0], blue[1], blue[2]);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.text("Ticket Platform Team", margin, y);

      // Save
      pdf.save(`ticket-${ticket.ticketNumber || ticket._id}.pdf`);
      message.destroy("pdf-gen");
      message.success("Ticket downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      message.destroy("pdf-gen");
      message.error("Failed to generate PDF. Please try again.");
    }
  };

  const columns = [
    {
      title: "Event",
      dataIndex: "event",
      key: "event",
      render: (event: any) => (
        <div className="flex items-center gap-3">
          {event?.image && (
            <img
              src={event.image}
              alt=""
              className="w-10 h-10 rounded-lg object-cover"
            />
          )}

          <div>
            <div className="font-bold">{event?.title}</div>

            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar size={12} />
              {moment(event?.date).format("MMM DD, YYYY")}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Ticket No",
      dataIndex: "ticketNumber",
      key: "ticketNumber",
      render: (text: string) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
          {text}
        </code>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Amount",
      dataIndex: "totalFare",
      key: "totalFare",
      render: (amount: number) => (
        <span className="font-semibold">
          ${(amount || 0).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "paid"
              ? "green"
              : status === "pending"
                ? "gold"
                : "red"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Link
            href={`/ticket/${record._id}`}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            View Ticket
          </Link>

          {record.status === "paid" && (
            <Button
              onClick={() => downloadTicket(record)}
              className="!text-green-600"
            >
              Download PDF
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center gap-3">
        <TicketIcon className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">
          My Tickets
        </h1>
      </div>

      <Card
        variant="borderless"
        className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden"
      >
        <Table
          columns={columns}
          dataSource={tickets}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
} 