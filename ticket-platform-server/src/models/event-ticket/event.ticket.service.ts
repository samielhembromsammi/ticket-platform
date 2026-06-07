import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { Event } from "../event/event.model";
import { generateTicketNumber } from "../../utils/generateTicketNumber";
import { generateQRCode } from "../../utils/generateQRCode";
import { EventTicket } from "./event.ticket.model";

const purchaseTicket = async (
    userId: string,
    payload: {
        eventId: string;
        paymentId?: string;
        transactionId?: string;
    }
) => {
    // Find event
    const event = await Event.findById(payload.eventId);

    if (!event) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "Event not found"
        );
    }

    // Prevent duplicate purchase
    const alreadyPurchased = await EventTicket.findOne({
        event: payload.eventId,
        user: userId,
    });

    if (alreadyPurchased) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "You already joined this event"
        );
    }

    // Generate ticket number
    const ticketNumber = generateTicketNumber();

    // Generate QR code
    const qrCode = await generateQRCode(ticketNumber);

    // Create ticket
    const ticket = await EventTicket.create({
        event: payload.eventId,
        user: userId,

        ticketNumber,
        qrCode,

        status: "paid",

        isUsed: false,

        price: event.price || 0,

        paymentId: payload.paymentId,

        transactionId: payload.transactionId,
    });

    return ticket;
};

const verifyTicket = async (ticketNumber: string) => {
    const ticket = await EventTicket.findOne({
        ticketNumber,
    })
        .populate("event")
        .populate("user");

    if (!ticket) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "Invalid ticket"
        );
    }

    return ticket;
};

const checkInTicket = async (ticketNumber: string) => {
    const ticket = await EventTicket.findOne({
        ticketNumber,
    });

    if (!ticket) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "Invalid ticket"
        );
    }

    if (ticket.isUsed) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Ticket already used"
        );
    }

    ticket.isUsed = true;

    ticket.status = "checked_in";

    ticket.usedAt = new Date();

    await ticket.save();

    return ticket;
};

const myTickets = async (userId: string) => {
    const result = await EventTicket.find({
        user: userId,
    })
        .populate("event")
        .sort({ createdAt: -1 });

    return result;
};

const getTicketById = async (id: string) => {
    const ticket = await EventTicket.findById(id)
        .populate("event")
        .populate("user");

    if (!ticket) {
        throw new AppError(StatusCodes.NOT_FOUND, "Ticket not found");
    }

    return ticket;
};

export const EventTicketService = {
    purchaseTicket,
    verifyTicket,
    getTicketById,
    checkInTicket,
    myTickets,
};