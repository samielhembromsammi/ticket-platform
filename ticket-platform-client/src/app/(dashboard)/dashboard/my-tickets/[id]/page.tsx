"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Card, message, Tag } from "antd";
import { Calendar, MapPin, Ticket as TicketIcon } from "lucide-react";
import moment from "moment";
import { useParams } from "next/navigation";

export default function TicketDetailsPage() {
    const params = useParams();
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await api.get(`/event-tickets/${params.id}`);
                setTicket(response.data.data);
            } catch (error) {
                message.error("Failed to load ticket");
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [params.id]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!ticket) {
        return <div className="flex items-center justify-center h-screen">Ticket not found</div>;
    }

    const { event, ticketNumber, quantity, totalFare, status, createdAt } = ticket;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6 flex items-center gap-3">
                <TicketIcon className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">Ticket Details</h1>
            </div>

            <Card
                className="rounded-2xl shadow-lg border-0 overflow-hidden mb-6"
                variant="borderless"
            >
                <div className="p-6">
                    {event?.image && (
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-64 object-cover rounded-xl mb-6"
                        />
                    )}
                    <div className="mb-4">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">{event?.title}</h2>
                        <div className="flex items-center gap-4 text-gray-600 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{moment(event?.date).format("MMM DD, YYYY")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                <span>{event?.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-gray-50">
                            <p className="text-xs text-gray-500">Ticket Number</p>
                            <p className="text-xl font-bold">{ticketNumber}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50">
                            <p className="text-xs text-gray-500">Quantity</p>
                            <p className="text-xl font-bold">{quantity}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50">
                            <p className="text-xs text-gray-500">Status</p>
                            <Tag
                                color={status === "paid" ? "green" : "gold"}
                                className="mt-1"
                            >
                                {status.toUpperCase()}
                            </Tag>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50">
                            <p className="text-xs text-gray-500">Total Fare</p>
                            <p className="text-xl font-bold">${(totalFare || 0).toFixed(2)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50">
                            <p className="text-xs text-gray-500">Purchased At</p>
                            <p className="text-base font-medium">{moment(createdAt).format("MMM DD, YYYY HH:mm:ss")}</p>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <button
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                            onClick={() => window.open(`/ticket/${ticket._id}?print=true`, "_blank")}
                        >
                            Download Ticket
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
}