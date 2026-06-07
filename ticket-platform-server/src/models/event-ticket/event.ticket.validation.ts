import { z } from "zod";

const purchaseTicket = z.object({
    eventId: z.string({
        message: "Event ID is required",
    }),

    paymentId: z.string().optional(),

    transactionId: z.string().optional(),
});

export const eventTicketValidation = {
    purchaseTicket,
};