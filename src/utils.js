import {fileURLToPath} from "url";
import { dirname } from "path";
import multer from "multer";

const filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(filename);

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, __dirname + "/public/images")
    },
    filename: (req, file, cb)=> {
        cb(null, file.originalname)
    }
});

export const uploader = multer({storage});

import bcrypt from 'bcrypt';

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);