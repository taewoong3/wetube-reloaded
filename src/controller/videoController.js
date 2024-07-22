import videoModel from "../models/video";

/*
    callback 함수는 모든 과정이 다 끝난 후에 실행이 되기 때문에, 순서가 뒤틀리는 경우가 많다.

    await가 중요한 이유
      -> 순서대로 위에서 아래로 코드가 실행되도록 await가 설정된 함수가 완료될 때까지 기다려준다. 직관적으로 어디서 기다려주는지 알기 편하다.
      -> 만약에 에러가 발생하면 catch문을 실행시킨다.
    */
export const home = async (req, res) => {
  try {
    const videos = await videoModel.find({});
    console.log(videos);
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    return res.send("server-error", error);
  }
};

export const watch = async (req, res) => {
  const { id } = req.params; //const id = req.params.id;
  const video = await videoModel.findById(id);
  return res.render("watch", { pageTitle: `${video.title}`, video });
};

export const getEdit = (req, res) => {
  const { id } = req.params; //const id = req.params.id;

  res.render("edit", { pageTitle: `Editing ` });
};

export const postEdit = (req, res) => {
  const id = req.params.id;
  const { title } = req.body; //form 안에 있는 value 의 Javascript representation(표시), 설정은 middleware에서 가능
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await videoModel.create({
      title: title,
      description: description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
      meta: {
        views: 2,
        rating: 3,
      },
    });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.render("upload", { pageTitle: "Upload Video", errorMessage: error._message });
  }
};
