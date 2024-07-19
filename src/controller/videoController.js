let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createAt: "2 minutes ago",
    views: 56,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 2,
    comments: 2,
    createAt: "2 minutes ago",
    views: 56,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 4,
    comments: 2,
    createAt: "2 minutes ago",
    views: 56,
    id: 3,
  },
  {
    title: "Four Video",
    rating: 1,
    comments: 2,
    createAt: "2 minutes ago",
    views: 56,
    id: 4,
  },
];

export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos });
};
export const see = (req, res) => {
  const { id } = req.params; //const id = req.params.id;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching ${video.title}` });
};
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("upload");
export const deleteVideo = (req, res) => res.send("Delete Video");
