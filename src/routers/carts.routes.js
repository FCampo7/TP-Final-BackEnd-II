import { Router } from "express";
import { authenticateJWT, authorizeRole } from "../middlewares/auth.middleware.js";
import { 
    getCartById, 
    createCart, 
    addProductToCart, 
    removeProductFromCart 
} from "../controllers/cart.controller.js";

const router = Router();

// Endpoint para crear carrito
router.post("/", createCart);

// Endpoint para obtener un carrito
router.get("/:cid", getCartById);

// Solo el usuario puede agregar productos a su carrito
router.post(
    "/:cid/product/:pid", 
    authenticateJWT, 
    authorizeRole(["user"]), 
    addProductToCart
);

// Permitimos al usuario remover productos de su carrito
router.delete(
    "/:cid/product/:pid", 
    authenticateJWT, 
    authorizeRole(["user"]), 
    removeProductFromCart
);

export default router;