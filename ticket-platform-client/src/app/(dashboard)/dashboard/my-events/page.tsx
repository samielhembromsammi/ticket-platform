"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Card, Row, Col, Empty, message, Button, Tag } from "antd";
import { CalendarDays, MapPin, ArrowRight, Users, Clock } from "lucide-react";
import moment from "moment";
import Link from "next/link";

export default function MyEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        // Logic: Fetch tickets and extract unique events
        const response = await api.get("/tickets/my");
        const tickets = response.data.data || [];
        const eventMap = new Map();
        
        tickets.forEach((t: any) => {
          if (t.event && t.event._id && !eventMap.has(t.event._id)) {
            eventMap.set(t.event._id, t.event);
          }
        });
        
        setEvents(Array.from(eventMap.values()));
      } catch (error) {
        // message.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center gap-3">
        <CalendarDays className="w-8 h-8 text-emerald-600" />
        <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
      </div>

      {events.length > 0 ? (
        <Row gutter={[24, 24]}>
          {events.map((event: any) => (
            <Col xs={24} sm={12} lg={8} key={event._id}>
              <Card 
                hoverable 
                variant="borderless"
                className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden group"
                cover={
                  <div className="relative h-48 overflow-hidden">
                    <img alt={event?.title} src={event?.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                      <Tag color="green" className="rounded-lg border-none px-3 py-1 font-bold shadow-sm backdrop-blur-md bg-emerald-500/90 text-white">UPCOMING</Tag>
                    </div>
                  </div>
                }
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{event?.title}</h3>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</span>
                      <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                        <CalendarDays size={14} className="text-blue-500" />
                        <span>{moment(event?.date).format("MMM DD, YYYY")}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time</span>
                      <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                        <Clock size={14} className="text-orange-500" />
                        <span>{event?.time || "10:00 AM"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Location</span>
                    <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <MapPin size={14} className="text-red-500" />
                      <span className="line-clamp-1">{event?.location}</span>
                    </div>
                  </div>
                </div>
                <Link href={`/events/${event?._id}`}>
                  <Button type="primary" block className="rounded-xl h-11 bg-emerald-600 hover:bg-emerald-700 border-none flex items-center justify-center gap-2 font-bold transition-all shadow-emerald-100 shadow-lg">
                    View Tickets <ArrowRight size={18} />
                  </Button>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl py-20">
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-gray-400">
                <p className="text-lg font-medium mb-2 text-gray-500">No events booked yet</p>
                <p>You haven't purchased tickets for any upcoming events.</p>
                <Link href="/events">
                  <Button type="primary" className="mt-6 h-10 px-8 rounded-lg bg-emerald-600 border-none font-bold">Discover Events</Button>
                </Link>
              </div>
            }
          />
        </Card>
      )}
    </div>
  );
}
