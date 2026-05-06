import { Router } from "express";
import { cartModel } from "../model/cartModel.js";

const router = Router();

router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findOne({ _id: cid })
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "error al obtener el carrito", error });
    }
});

router.post("/", async (req, res) => {
    try {
        const newCart = await cartModel.create({});
        res.status(200).json({ message: "carrito creado", newCart });
    } catch (error) {
        res.status(500).json({ message: "error al crear el carrito", error });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const { productModel } = (await import("../model/productModel.js"));
        const product = await productModel.findById(pid);
        if (!product) return res.status(404).json({ message: "producto no encontrado" });
        let cart = await cartModel.findOneAndUpdate(
            { _id: cid, "products.product": pid },
            { $inc: { "products.$.quantity": 1 } },
            { new: true }
        );
        if (!cart) return res.status(404).json({ message: "carrito no encontrado" });
        else res.status(200).json({ message: "carrito actualizado", cart });
    } catch (error) {
        res.status(500).json({ message: "error al agregar el producto al carrito", error });
    }
});

router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartModel.findOneAndUpdate(
            { _id: cid },
            { $pull: { products: { product: pid } } },
            { new: true }
        );
        res.status(200).json({ message: "producto eliminado del carrito", cart });
    } catch (error) {
        res.status(500).json({ message: "error al eliminar el producto del carrito", error });
    }
});

export default router;