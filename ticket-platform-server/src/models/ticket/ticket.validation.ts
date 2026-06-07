import { z } from "zod";

const purchaseTicket = z.object({
  eventId: z.string({ message: "Event ID is required" }),
  quantity: z.number({ message: "Quantity is required" }).min(1),
});

export const ticketValidation = {
  purchaseTicket,
};
