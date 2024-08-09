import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./router/rootRouter";
import videoRouter from "./router/videoRouter";
import userRouter from "./router/userRouter";
import { localsMiddleWare } from "./middlewares";

const app = express(); // Creatings Express Server

const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger); // middelWare
app.use(express.urlencoded({ extended: true })); //클라이언트에서 보내는 URL-encoded 데이터(즉, HTML 폼 데이터)를 Express 애플리케이션에서 파싱할 수 있도록 하기 위함

app.use(
  session({
    secret: process.env.COOKIE_SECRET, // 세션 암호화에 사용되는 비밀 키
    resave: false, // 세션이 수정되지 않더라도 다시 저장할지 여부
    saveUninitialized: false, // 초기화되지 않은 세션을 저장할지 여부, (즉, backend가 로그인한 사용자에게만 쿠키를 주도록 설정됐다는 말.)
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }), //cookie에는 sessionID만 저장되고, session 자체는 DB에 저장된다. session 자체를 DB에 저장하기 위함.
    cookie: {
      // maxAge: 20000, //만료시간을 설정
      secure: false, // HTTPS 사용 시 secure를 true로 설정
    },
  })
);

// Session ID 확인용
app.get("/add-one", (req, res, next) => {
  req.session.potato += 1;
  console.log("req.session.id = ", req.session);
  return res.send(`${req.session.id}\n${req.session.potato}`);
});

app.use(localsMiddleWare);
app.use("/uploads", express.static("uploads"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
