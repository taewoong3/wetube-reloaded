import mongoose from "mongoose";

// 형식만 지정해준다.
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: { type: String, required: true, minLength: 20 },
  createDate: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: Number,
    rating: Number,
  },
});

videoSchema.pre("save", async function () {
  this.hashtags = this.hashtags[0].split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const videoModel = mongoose.model("video", videoSchema);

export default videoModel;
