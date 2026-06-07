import QRCode from "qrcode";

export const generateQRCode = async (
    ticketNumber: string
): Promise<string> => {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-ticket/${ticketNumber}`;

    return await QRCode.toDataURL(verificationUrl);
};