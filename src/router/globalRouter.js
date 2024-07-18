import express from "express";
import { trending, search } from "../controller/videoController";
import { join, login } from "../controller/userController";

const globalRounter = express.Router();

globalRounter.get("/", trending);
globalRounter.get("/join", join);
globalRounter.get("/login", login);
globalRounter.get("/search", search);

export default globalRounter;
