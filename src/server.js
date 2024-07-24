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
app.use(express.urlencoded({ extended: true })); //클라이언트에서 보내는 URL-encoded 데이터(즉, HTML 폼 데이터)를 Express 애플리케이션에서 파싱할 수 있도록 하기 위함
app.use("/", globalRounter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
