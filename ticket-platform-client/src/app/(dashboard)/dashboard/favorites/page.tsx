"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Card, Row, Col, Empty, message, Button } from "antd";
import { Heart, Calendar, MapPin, ArrowRight } from "lucide-react";
import moment from "moment";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get("/favorites/my");
        // The API returns an array of Favorite objects, each has an 'event' property
        const favoriteEvents = response.data.data.map((fav: any) => fav.event).filter((e: any) => e !== null);
        setFavorites(favoriteEvents);
      } catch (error) {
        message.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center gap-3">
        <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
        <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
      </div>

      {favorites.length > 0 ? (
        <Row gutter={[24, 24]}>
          {favorites.map((event: any) => (
            <Col xs={24} sm={12} lg={8} key={event._id}>
              <Card 
                hoverable 
                variant="borderless"
                className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden group"
                cover={
                  <div className="relative h-48 overflow-hidden">
                    <img alt={event.title} src={event.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full shadow-sm">
                      <Heart size={18} className="text-pink-500 fill-pink-500" />
                    </div>
                  </div>
                }
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{event.title}</h3>
                  <div className="mt-3 flex flex-col gap-2 text-gray-500 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-blue-500" />
                      <span>{moment(event.date).format("MMMM DD, YYYY")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-red-500" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                </div>
                <Link href={`/events/${event._id}`}>
                  <Button type="primary" block className="rounded-xl h-10 bg-blue-600 flex items-center justify-center gap-2">
                    View Details <ArrowRight size={16} />
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
                <p className="text-lg font-medium mb-2 text-gray-500">No favorite events yet</p>
                <p>Start exploring events and save the ones you like!</p>
                <Link href="/events">
                  <Button type="primary" className="mt-6 h-10 px-8 rounded-lg bg-blue-600">Browse Events</Button>
                </Link>
              </div>
            }
          />
        </Card>
      )}
    </div>
  );
}
