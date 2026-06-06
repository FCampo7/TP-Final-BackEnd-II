import express from "express";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import productsRouter from "./routers/products.routes.js";
import cartsRouter from "./routers/carts.routes.js";
import viewsRouter from "./routers/views.routes.js";
import sessionsRouter from "./routers/sessions.routes.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import config from "./config/config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

const httpServer = app.listen(config.port, () => {
	console.log(`server escuchando en ${config.port}`);
	mongoose
		.connect(config.mongoUri)
		.then(() => console.log("conectado a DB"));
});

const socketServer = new Server(httpServer);
socketServer.on("connection", (socket) => {});

app.set("socketServer", socketServer);
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

app.use("/", viewsRouter);

app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/api/sessions", sessionsRouter);
