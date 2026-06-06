import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { 
    register, 
    login, 
    current, 
    forgotPassword, 
    resetPassword 
} from "../controllers/session.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// El controller de current ahora usa UserDTO para no enviar data sensible
router.get("/current", authenticateJWT, current);

// Flujo de recuperación de contraseña
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
