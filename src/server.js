import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./router/rootRouter";
import videoRouter from "./router/videoRouter";
import userRouter from "./router/userRouter";

const app = express(); // Creatings Express Server

const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger); // middelWare
app.use(express.urlencoded({ extended: true })); //클라이언트에서 보내는 URL-encoded 데이터(즉, HTML 폼 데이터)를 Express 애플리케이션에서 파싱할 수 있도록 하기 위함

app.use(
  session({
    secret: "Hello!", // 세션 암호화에 사용되는 비밀 키
    resave: true, // 세션이 수정되지 않더라도 다시 저장할지 여부
    saveUninitialized: true, // 초기화되지 않은 세션을 저장할지 여부
    //cookie: { secure: false }, // HTTPS 사용 시 secure를 true로 설정
  })
);

app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    console.log(sessions);
    next();
  });
});

// Session ID 확인용
app.get("/add-one", (req, res, next) => {
  req.session.potato += 1;
  console.log("mrx cookie = ", req.session.cookie);
  return res.send(`${req.session.id}\n${req.session.potato}`);
});

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
