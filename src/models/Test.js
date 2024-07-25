import mongoose from "mongoose";

const testSchema = mongoose.Schema({});

const Test = mongoose.model("test", testSchema);

export default Test;

/**
 * 예시
 */
