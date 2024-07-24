import express from "express";
import { watch, getEdit, postEdit, getUpload, postUpload, deleteVideo } from "../controller/videoController";

const videoRouter = express.Router();

videoRouter.route("/:id([0-9a-z]{24})").get(watch);
videoRouter.route("/:id([0-9a-z]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-z]{24})/delete").get(deleteVideo);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
