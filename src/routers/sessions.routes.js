import { Router } from "express";
import userModel from "../model/userModel.js";
import { createHash, isValidPassword } from "../utils.js";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = Router();

router.post("/register", async (req, res) => {
	const { first_name, last_name, email, age, password, role } = req.body;

	if (!first_name || !last_name || !email || !age || !password) {
		return res
			.status(400)
			.send({ status: "error", error: "Incomplete values" });
	}

	try {
		const exist = await userModel.findOne({ email });
		if (exist) {
			return res
				.status(400)
				.send({ status: "error", error: "User already exists" });
		}

		const user = {
			first_name,
			last_name,
			email,
			age,
			password: createHash(password),
			role: role || "user",
		};

		const result = await userModel.create(user);
		res.send({ status: "success", payload: result });
	} catch (error) {
		console.error("Error en registro:", error);
		res.status(500).send({
			status: "error",
			error: error.message || "Internal Server Error",
		});
	}
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await userModel.findOne({ email });
		if (!user) {
			return res
				.status(401)
				.send({ status: "error", error: "Incorrect credentials" });
		}

		if (!isValidPassword(user, password)) {
			return res
				.status(401)
				.send({ status: "error", error: "Incorrect credentials" });
		}

		const tokenUser = {
			id: user._id,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			role: user.role,
			cart: user.cart,
		};

		const token = jwt.sign({ user: tokenUser }, "coderSecretKey", {
			expiresIn: "24h",
		});

		res.cookie("jwtCookie", token, {
			maxAge: 60 * 60 * 1000 * 24,
			httpOnly: true,
		}).send({ status: "success", message: "Logged in successfully" });
	} catch (error) {
		res.status(500).send({
			status: "error",
			error: "Internal Server Error",
		});
	}
});

router.get(
	"/current",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		res.send({ status: "success", payload: req.user });
	},
);

export default router;
