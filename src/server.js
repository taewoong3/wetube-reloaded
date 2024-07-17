import express from "express";
import morgan from "morgan";
import globalRounter from "./router/globalRouter";
import videoRouter from "./router/videoRouter";
import userRouter from "./router/userRouter";

const app = express(); // Creatings Express Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);
});

const logger = morgan("dev");
app.use(logger);

app.use("/", globalRounter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

// #4.6 Start
