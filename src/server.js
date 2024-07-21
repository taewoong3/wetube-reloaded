import express from "express";

import morgan from "morgan";
import globalRounter from "./router/globalRouter";
import videoRouter from "./router/videoRouter";
import userRouter from "./router/userRouter";

const app = express(); // Creatings Express Server

const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger); // middelWare
app.use(express.urlencoded({ extended: true })); //req.body() 가 존재하는 시점
app.use("/", globalRounter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
