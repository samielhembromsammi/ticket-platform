import { model, Schema } from "mongoose";
import { IEventTicket } from "./event.ticket.interface";

const eventTicketSchema = new Schema<IEventTicket>(
    {
        event: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            index: true,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        ticketNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        qrCode: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "paid",
                "checked_in",
                "cancelled",
                "expired",
            ],
            default: "pending",
        },

        isUsed: {
            type: Boolean,
            default: false,
        },

        usedAt: {
            type: Date,
        },

        paymentId: {
            type: String,
        },

        transactionId: {
            type: String,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
        vat: {
            type: Number,
            default: 0,
        },
        serviceCharge: {
            type: Number,
            default: 0,
        },
        totalFare: {
            type: Number,
        },
        identificationType: {
            type: String,
        },
        identificationNumber: {
            type: String,
        },
        pnrNumber: {
            type: String,
        },
        coPassenger1: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const EventTicket = model<IEventTicket>(
    "EventTicket",
    eventTicketSchema
);