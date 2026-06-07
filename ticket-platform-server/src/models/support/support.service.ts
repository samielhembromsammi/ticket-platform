import { Support } from "./support.model";

export const SupportService = {
  createTicket: async (data: any) => {
    return await Support.create(data);
  },

  getAllTickets: async () => {
    return await Support.find().populate("user").sort({ createdAt: -1 });
  },

  updateTicketStatus: async (id: string, status: string) => {
    return await Support.findByIdAndUpdate(id, { status }, { new: true });
  },

  getMyTickets: async (userId: string) => {
    return await Support.find({ user: userId }).sort({ createdAt: -1 });
  },
};
