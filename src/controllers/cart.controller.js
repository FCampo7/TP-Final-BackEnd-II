import CartRepository from "../repositories/CartRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";

const cartRepo = new CartRepository();
const productRepo = new ProductRepository();

export const getCartById = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartRepo.getCartById(cid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "error al obtener el carrito", error });
    }
};

export const createCart = async (req, res) => {
    try {
        const newCart = await cartRepo.createCart({});
        res.status(200).json({ message: "carrito creado", newCart });
    } catch (error) {
        res.status(500).json({ message: "error al crear el carrito", error });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const product = await productRepo.getProductById(pid);
        if (!product) return res.status(404).json({ message: "producto no encontrado" });

        const cart = await cartRepo.addProductToCart(cid, pid);
        if (!cart) return res.status(404).json({ message: "carrito no encontrado" });
        
        res.status(200).json({ message: "carrito actualizado", cart });
    } catch (error) {
        res.status(500).json({ message: "error al agregar el producto al carrito", error });
    }
};

export const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartRepo.removeProductFromCart(cid, pid);
        res.status(200).json({ message: "producto eliminado del carrito", cart });
    } catch (error) {
        res.status(500).json({ message: "error al eliminar el producto del carrito", error });
    }
};
