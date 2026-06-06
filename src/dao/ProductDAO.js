import { productModel } from "../model/productModel.js";

export default class ProductDAO {
    async get(query = {}) {
        return await productModel.find(query);
    }
    
    async getById(id) {
        return await productModel.findById(id);
    }

    async create(data) {
        return await productModel.create(data);
    }

    async update(id, data) {
        return await productModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await productModel.findByIdAndDelete(id);
    }
    
    async getLowStock(limit = 10) {
        return await productModel.aggregate([
            { $match: { stock: { $lt: limit } } },
            { $project: { title: "$title", stock: "$stock", category: "$category" } },
            { $group: { _id: "$category", products: { $push: { title: "$title", stock: "$stock" } } } },
            { $merge: { into: "stock_reports" } }
        ]);
    }
}
