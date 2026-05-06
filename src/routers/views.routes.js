import { Router } from "express";
import { productModel } from "../model/productModel.js";
const router = Router();

router.get("/products", async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const pagination = await productModel.paginate({}, {
            limit: 10,
            page: page,
            lean: true
        });

        res.status(200).render("products", {
            pagination,
            styles: {
                main: "/css/main.css",
                products: "/css/products.css"
            }
        })
    } catch (error) {
        res.status(500).send("Error al obtener los productos");
    }
});

router.get("/create-product", async (req, res) => {
    try {
        res.status(200).render("product-form");
    } catch (error) {
        res.status(500).send("Error al obtener el formulario");
    }
});

export default router;