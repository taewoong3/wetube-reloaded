import express from "express";
import morgan from "morgan";
import globalRounter from "./router/globalRouter";
import videoRouter from "./router/videoRouter";
import userRouter from "./router/userRouter";

const app = express(); // Creatings Express Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);
  console.log(process.cwd()); // 현재 프로젝트 폴더 위치
});

const logger = morgan("dev");
app.use(logger);

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use("/", globalRounter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
