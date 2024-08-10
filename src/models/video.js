import mongoose from "mongoose";

// 형식만 지정해준다.
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true },
  createDate: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: Number,
    rating: Number,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, //ref - 연결 할 모델명 즉, 연결한 모델에서 ObjectId가 넘어 온다는 의미.
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const videoModel = mongoose.model("video", videoSchema);

export default videoModel;
