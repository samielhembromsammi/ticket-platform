import crypto from "crypto";

export const generateTicketNumber = (): string => {
    const randomPart = crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();

    return `TK-${randomPart}`;
};