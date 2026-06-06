import userModel from "../model/userModel.js";

export default class UserDAO {
    async get(query) {
        return await userModel.find(query);
    }
    
    async getById(id) {
        return await userModel.findById(id);
    }

    async getByEmail(email) {
        return await userModel.findOne({ email });
    }

    async create(data) {
        return await userModel.create(data);
    }

    async update(id, data) {
        return await userModel.findByIdAndUpdate(id, data, { new: true });
    }

    async getByToken(token) {
        return await userModel.findOne({ 
            resetPasswordToken: token, 
            resetPasswordExpires: { $gt: Date.now() } 
        });
    }
}
