import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "join" });
export const postJoin = async (req, res) => {
  const { email, username, password, password2, name, location } = req.body;
  const pageTitle = "Join";
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (password !== password2) {
    return res.status(400).render("Join", { pageTitle, errorMessage: "The Password confirmation does not match" });
  }
  if (exists) {
    console.log("[mrx] Exists = ", exists);
    return res.status(400).render("join", { pageTitle, errorMessage: "This username/email is already taken." });
  }
  try {
    await User.create({
      email,
      username,
      password,
      name,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.status(400).render("join", { pageTitle, errorMessage: error._message });
  }
};

export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const exists = await User.exists({ username });
  if (!exists) {
    console.log("exists = ", exists);
    return res.status(400).render("login", { pageTitle, errorMessage: "An account with this username does not exists" });
  }
  const user = await User.findById(exists._id);

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", { pageTitle, errorMessage: "Wrong Password" });
  }
  // req.session.[변수]
  req.session.loggedIn = true;
  req.session.user = user;
  console.log("[UserController]req.session = ", req.session);
  return res.redirect("/");
};

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");

export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See");
