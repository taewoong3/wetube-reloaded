import express from "express";
import { trending } from "../controller/videoController";
import { join } from "../controller/userController";

const globalRounter = express.Router();

globalRounter.get("/", trending);
globalRounter.get("/join", join);

export default globalRounter;
