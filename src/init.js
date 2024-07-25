import "./db";
import "./models/video";
import "./models/User";
import app from "./server";

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);
  console.log(process.cwd()); // 현재 프로젝트 폴더 위치
});
