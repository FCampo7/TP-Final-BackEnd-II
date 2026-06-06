import UserDAO from "../dao/UserDAO.js";

export default class UserRepository {
    constructor() {
        this.dao = new UserDAO();
    }

    async getUserById(id) {
        return await this.dao.getById(id);
    }

    async getUserByEmail(email) {
        return await this.dao.getByEmail(email);
    }

    async createUser(user) {
        return await this.dao.create(user);
    }

    async updateUser(id, user) {
        return await this.dao.update(id, user);
    }

    async getUserByToken(token) {
        return await this.dao.getByToken(token);
    }
}
