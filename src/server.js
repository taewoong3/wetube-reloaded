import express from "express";
import morgan from "morgan";

const app = express(); // Creatings Express Server

const PORT = 4000;
const logger = morgan("dev");

app.listen(PORT, () => {
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);
});

const handleLogin = (req, res) => {
  console.log("Welcome to LoginPage");
  return res.send("Login Page Here");
};
const handleHome = (req, res) => {
  console.log("I love MiddleWare");
  return res.send("Welcome to Home");
};

const handleProtected = (req, res, next) => {
  return res.send("Welcome to the private Our Lounge");
};

app.use(logger);

app.get("/", handleHome);
app.get("/login", handleLogin);
app.get("/protected", handleProtected);
