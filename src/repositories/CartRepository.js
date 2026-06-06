import CartDAO from "../dao/CartDAO.js";

export default class CartRepository {
    constructor() {
        this.dao = new CartDAO();
    }

    async getCartById(id) {
        return await this.dao.getById(id);
    }

    async createCart(data) {
        return await this.dao.create(data);
    }

    async addProductToCart(cartId, productId) {
        // Intentar incrementar si ya existe
        let cart = await this.dao.addProductToCart(cartId, productId);
        // Si no existe el producto en el carrito, se agrega al array
        if (!cart) {
            cart = await this.dao.addProductToCartNew(cartId, productId);
        }
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        return await this.dao.removeProductFromCart(cartId, productId);
    }
}
