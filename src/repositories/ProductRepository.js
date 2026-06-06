import ProductDAO from "../dao/ProductDAO.js";

export default class ProductRepository {
    constructor() {
        this.dao = new ProductDAO();
    }

    async getProducts(query) {
        return await this.dao.get(query);
    }

    async getProductById(id) {
        return await this.dao.getById(id);
    }

    async createProduct(product) {
        return await this.dao.create(product);
    }

    async updateProduct(id, product) {
        return await this.dao.update(id, product);
    }

    async deleteProduct(id) {
        return await this.dao.delete(id);
    }
    
    async getLowStockReports() {
        return await this.dao.getLowStock();
    }
}
