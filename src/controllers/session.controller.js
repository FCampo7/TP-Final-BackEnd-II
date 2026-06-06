import UserRepository from "../repositories/UserRepository.js";
import { createHash, isValidPassword } from "../utils.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/UserDTO.js";
import crypto from "crypto";
import { sendEmail, sendSMS } from "../services/mailing.service.js";
import config from "../config/config.js";

const userRepo = new UserRepository();

export const register = async (req, res) => {
    const { first_name, last_name, email, age, password, role } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).send({ status: "error", error: "Incomplete values" });
    }

    try {
        const exist = await userRepo.getUserByEmail(email);
        if (exist) {
            return res.status(400).send({ status: "error", error: "User already exists" });
        }

        const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: role || "user",
        };

        const result = await userRepo.createUser(user);
        res.send({ status: "success", payload: new UserDTO(result) });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).send({ status: "error", error: error.message || "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userRepo.getUserByEmail(email);
        if (!user) {
            return res.status(401).send({ status: "error", error: "Incorrect credentials" });
        }

        if (!isValidPassword(user, password)) {
            return res.status(401).send({ status: "error", error: "Incorrect credentials" });
        }

        const tokenUser = new UserDTO(user);

        const token = jwt.sign({ user: { ...tokenUser } }, config.jwtSecret, { expiresIn: "24h" });

        res.cookie("jwtCookie", token, {
            maxAge: 60 * 60 * 1000 * 24,
            httpOnly: true,
        }).send({ status: "success", message: "Logged in successfully", token });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal Server Error" });
    }
};

export const current = (req, res) => {
    const userDto = new UserDTO(req.user);
    res.send({ status: "success", payload: userDto });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userRepo.getUserByEmail(email);
        if (!user) {
            // No revelamos si el usuario existe o no
            return res.status(200).json({ message: "Si el correo está registrado, se enviará un enlace de recuperación." });
        }

        const token = crypto.randomBytes(20).toString("hex");
        const expire = Date.now() + 3600000; // 1 hora
        
        await userRepo.updateUser(user._id, {
            resetPasswordToken: token,
            resetPasswordExpires: expire
        });

        const resetLink = `http://localhost:${config.port}/api/sessions/reset-password/${token}`;
        
        await sendEmail(
            user.email,
            "Recuperación de Contraseña - Ecommerce",
            `<p>Has solicitado restablecer tu contraseña.</p>
             <p>Haz clic en este <a href="${resetLink}">enlace</a> o pégalo en tu navegador para completar el proceso:</p>
             <p>${resetLink}</p>
             <p>Este enlace expirará en 1 hora.</p>`
        );

        res.status(200).json({ message: "Correo de recuperación enviado." });
    } catch (error) {
        console.error("Error en forgotPassword:", error);
        res.status(500).json({ message: "Error al procesar la solicitud." });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await userRepo.getUserByToken(token);
        if (!user) {
            return res.status(400).json({ message: "El enlace es inválido o ha expirado." });
        }

        // Validar que la nueva contraseña no sea la misma que la anterior
        if (isValidPassword(user, newPassword)) {
            return res.status(400).json({ message: "La nueva contraseña no puede ser igual a la anterior." });
        }

        // Actualizar contraseña
        await userRepo.updateUser(user._id, {
            password: createHash(newPassword),
            resetPasswordToken: null,
            resetPasswordExpires: null
        });

        // Enviar SMS notificando el cambio de contraseña (Opcional, según consigna)
        // Usamos el número de Twilio en el config o uno por defecto
        // await sendSMS("+5491112345678", "Tu contraseña ha sido restablecida exitosamente.");

        res.status(200).json({ message: "Contraseña actualizada con éxito. Ya puedes iniciar sesión." });
    } catch (error) {
        console.error("Error en resetPassword:", error);
        res.status(500).json({ message: "Error al restablecer la contraseña." });
    }
};
