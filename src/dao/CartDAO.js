import { cartModel } from "../model/cartModel.js";

export default class CartDAO {
    async getById(id) {
        return await cartModel.findOne({ _id: id });
    }

    async create(data = {}) {
        return await cartModel.create(data);
    }

    async addProductToCart(cartId, productId) {
        return await cartModel.findOneAndUpdate(
            { _id: cartId, "products.product": productId },
            { $inc: { "products.$.quantity": 1 } },
            { new: true }
        );
    }
    
    async addProductToCartNew(cartId, productId) {
        return await cartModel.findOneAndUpdate(
            { _id: cartId },
            { $push: { products: { product: productId, quantity: 1 } } },
            { new: true }
        );
    }

    async removeProductFromCart(cartId, productId) {
        return await cartModel.findOneAndUpdate(
            { _id: cartId },
            { $pull: { products: { product: productId } } },
            { new: true }
        );
    }
}
