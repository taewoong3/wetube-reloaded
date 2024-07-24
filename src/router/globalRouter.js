import express from "express";
import { home, search } from "../controller/videoController";
import { join, login } from "../controller/userController";

const globalRounter = express.Router();

globalRounter.get("/", home);
globalRounter.get("/join", join);
globalRounter.get("/login", login);
globalRounter.get("/search", search);

export default globalRounter;
