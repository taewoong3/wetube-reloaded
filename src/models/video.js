import mongoose from "mongoose";

// 형식만 지정해준다.
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createDate: Date,
  hashtags: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
});

const videoModel = mongoose.model("video", videoSchema);

export default videoModel;
