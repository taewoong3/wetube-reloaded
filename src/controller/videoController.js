import User from "../models/User";
import videoModel from "../models/video";

/*
    callback 함수는 모든 과정이 다 끝난 후에 실행이 되기 때문에, 순서가 뒤틀리는 경우가 많다.

    await가 중요한 이유
      -> 순서대로 위에서 아래로 코드가 실행되도록 await가 설정된 함수가 완료될 때까지 기다려준다. 직관적으로 어디서 기다려주는지 알기 편하다.
      -> 만약에 에러가 발생하면 catch문을 실행시킨다.
    */
export const home = async (req, res) => {
  try {
    const videos = await videoModel.find({}).sort({ createDate: "desc" });
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    return res.send("server-error", error);
  }
};

export const watch = async (req, res) => {
  const { id } = req.params; //const id = req.params.id;
  const video = await videoModel.findById(id).populate("owner");
  console.log(video);
  if (video === null) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: `${video.title}`, video });
};

export const getEdit = async (req, res) => {
  //const { id } = req.params; -- const id = req.params.id;
  const {
    session: {
      user: { _id },
    },
    params: { id },
  } = req;
  const video = await videoModel.findById(id);
  if (!video) {
    res.status(404).render("404", { pageTitle: "Video not Found" });
  }
  // '==' 은 type까지 비교하기 때문.
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  res.render("edit", { pageTitle: `${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    params: { id },
  } = req;
  const { title, description, hashtags } = req.body; //form 안에 있는 value 의 Javascript representation(표시), 설정은 middleware에서 가능
  const video = await videoModel.exists({ _id: id });
  if (!video) {
    res.status(404).render("404", { pageTitle: "Video not Found" });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await videoModel.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: videoModel.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    file: { path: fileUrl },
    body: { title, description, hashtags },
  } = req;

  try {
    const newVideo = await videoModel.create({
      title,
      description,
      fileUrl,
      owner: _id,
      hashtags: videoModel.formatHashtags(hashtags),
      meta: {
        views: 2,
        rating: 3,
      },
    });
    //Video를 업로드할 때, User에 저장
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", { pageTitle: "Upload Video", errorMessage: error._message });
  }
};

export const deleteVideo = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    params: { id },
  } = req;
  const video = await videoModel.findById(id);
  console.log(video);
  if (!video) {
    res.status(404).render("404", { pageTitle: "Video not Found" });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  // delete video
  await videoModel.findByIdAndDelete(id); //findByOneAndDelete() 함수를 사용하는게 좋다. findByIdAndDelete() 는 findByOneAndDelete() 함수의 간략한 버전
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await videoModel.find({
      title: {
        //https://www.mongodb.com/docs/manual/reference/operator/query/eq/ 다양한 기능이 존재
        // $regex: new RegExp(`${keyword}`, "i"), // i 는 대소문자 구분 없이
        $regex: `${keyword}`,
        $options: "i",
      },
    });
    console.log(videos);
  }
  return res.render("search", { pageTitle: `Search`, videos });
};
