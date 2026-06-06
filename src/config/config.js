import dotenv from "dotenv";

dotenv.config();

export default {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce",
    jwtSecret: process.env.JWT_SECRET || "coderSecretKey",
    mailer: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER
    }
};
