import { json, Router, urlencoded } from "express";
import { uploader } from "../utils.js";
import { authenticateJWT, authorizeRole } from "../middlewares/auth.middleware.js";
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getStockReports 
} from "../controllers/product.controller.js";

const router = Router();

router.use(urlencoded({ extended: true }));
router.use(json());

// Acceso público (o como esté definido en la aplicación) para ver productos
router.get("/", getProducts);
router.get("/stock", getStockReports);
router.get("/:pid", getProductById);

// Solo el admin puede crear, actualizar y eliminar productos
router.post(
    "/", 
    authenticateJWT, 
    authorizeRole(["admin"]), 
    uploader.array("thumbnails", 10), 
    createProduct
);

router.put(
    "/:pid", 
    authenticateJWT, 
    authorizeRole(["admin"]), 
    updateProduct
);

router.delete(
    "/:pid", 
    authenticateJWT, 
    authorizeRole(["admin"]), 
    deleteProduct
);

export default router;