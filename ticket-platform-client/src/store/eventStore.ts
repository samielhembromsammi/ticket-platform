import { create } from "zustand";

interface Event {
  _id: string;
  title: string;
  description: string;
  categoryId: any;
  date: string;
  location: string;
  image: string;
  isPremium: boolean;
  price?: number;
  totalTickets: number;
  soldTickets: number;
}

interface EventState {
  events: Event[];
  setEvents: (events: Event[]) => void;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  setEvents: (events) => set({ events }),
}));
