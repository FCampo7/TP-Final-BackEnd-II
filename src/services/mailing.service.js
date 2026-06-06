import nodemailer from "nodemailer";
import twilio from "twilio";
import config from "../config/config.js";

// Transportador de Nodemailer
export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.mailer.user,
        pass: config.mailer.pass
    }
});

// Cliente de Twilio
// export const twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken);

export const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: config.mailer.user,
            to,
            subject,
            html
        };
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error("Error al enviar email:", error);
        throw error;
    }
};

export const sendSMS = async (to, body) => {
    try {
        /* Descomentar cuando se tengan credenciales válidas
        const message = await twilioClient.messages.create({
            body,
            from: config.twilio.phoneNumber,
            to
        });
        return message;
        */
        console.log(`[SMS Simulando envío] a ${to}: ${body}`);
        return { status: "simulated" };
    } catch (error) {
        console.error("Error al enviar SMS:", error);
        throw error;
    }
};
