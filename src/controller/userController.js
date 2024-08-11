import User from "../models/User";
import bcrypt from "bcrypt";
import Video from "../models/video";

// Login
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

// Join
export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialLoginOnly: false });
  if (!user) {
    return res.status(400).render("login", { pageTitle, errorMessage: "An account with this username does not exists" });
  }
  // const findUser = await User.findOne({ username, socialLoginOnly: false });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", { pageTitle, errorMessage: "Wrong Password" });
  }
  // req.session.[변수]
  // session을 초기화하는 유일한 부분.
  req.session.loggedIn = true;
  req.session.user = user;
  console.log("[UserController]req.session = ", req.session);
  return res.redirect("/");
};

// SNS Login
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  //- "scope"는 개발자가 사용자에 대해 어디까지 알 수 있는지 적으면 된다. (여러개를 요구하고 싶을 때 URL에 스페이스바 누르고 scope 조건 추가)
  //- "allow_signup"은 사용자가 github 아이디가 없다면 생성하게 할래? (true or false)
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    allow_signup: false,
    scope: "read:user user:email", //scope은 공백으로 나눠야 한다.
  };
  const params = new URLSearchParams(config).toString(); // 'clientId=Ov23liNKa6zO7IYsTcfY&allow_signup=false&scope=read%3Auser+user%3Aemail' 코드 실행 결과
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    client_secret: process.env.GITHUB_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  //NodeJS 18 버전 이상부터는 fetch() 기능이 탑재 (참고, fetch() 기능은 "브라우저에서 서버로 데이터 요청을 보내고, 응답을 받아 처리하는 도구")
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  //access_token은 scope에 명시한 부분을 볼 수 있게 해주는 역할.
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log("userData = ", userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObject = emailData.find((email) => email.primary === true && email.verified === true);
    if (!emailObject) {
      return res.render("/login");
    }
    //로그인 규칙을 어떻게 만들 것인가? (Ex.중복된 email이 있을 경우 어떻게 처리할 것인가 등 여러가지 조건에서 생각해볼 것)
    let user = await User.findOne({ email: emailObject.email });
    console.log("existsUser = ", user);
    if (!user) {
      //DB에 해당 email을 가진 user가 없을 때
      user = await User.create({
        email: emailObject.email,
        avatarUrl: userData.avatar_url,
        username: userData.login,
        password: "",
        name: userData.name,
        socialLoginOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

// User - Edit
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const pageTitle = "Edit Profile";
  // const id = req.session.user.id;
  // const { name, email, username, location } = req.body;
  const {
    session: {
      user: { _id, email: currentEmail, username: currentUsername, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;

  const findUser = await User.findOne({ $and: [{ _id: { $ne: _id } }, { $or: [{ email }, { username }] }] });
  if (findUser) {
    if (currentEmail === email || currentUsername === username) {
      return res.status(400).render("edit-profile", { pageTitle, errorMessage: "This email/username is already taken" });
    }
  }
  /**
   * Important! "Never save files in the database. Instead, save the file locations in the database."
   */
  const updatedUser = await User.findByIdAndUpdate(_id, { avatarUrl: file ? file.path : avatarUrl, name, email, username, location }, { new: true }); // [Reference - Options.new] if true, return the modified document rather than the original.
  req.session.user = updatedUser;
  return res.redirect("/users/edit");

  /*
Session은 DB와 연결되어 있지 않기 때문에, 따로 업데이트를 진행해줘야 한다.
아래 처럼 따로따로 업데이트 해주는 방식도 존재하지만, 비효율적이다. 그래서 "Options.new" 를 사용해서 수정된 내용을 리턴하는 방식 사용.

  req.session.user = {
    ...req.session.user, -- req.session.user 안에 있는 내용을 밖으로 전해주는 것
    name,
    email,
    username,
    location,
  };
  */
};

// Logout
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getChangePassword = (req, res) => {
  return res.render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", { pageTitle: "Change Password", errorMessage: "The password does not match the confirmation" });
  }
  //처음부터 DB에서 찾은 유저의 비밀번호를 비교 대상군으로 입력하면, session을 업데이트 해주는 수고를 덜 할 수 있다.
  const user = await User.findById({ _id });
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", { pageTitle: "Change Password", errorMessage: "The current Password is Wrong" });
  }

  user.password = newPassword;
  await user.save(); // save() 함수를 동작하면, User model에 있는 bcrypt.hash()가 동작한다.
  /** 두가지 방법이 있다.
   * 1. session을 사용하면 무조건 session을 업데이트 해줘야 한다.
   * 2. 처음부터 DB에서 비밀번호를 가져와서 비교하는 것!!
   *
   * req.session.user.password = user.password;
   */
  // send notification
  return res.redirect("/users/logout");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  console.log(user);
  if (!user) {
    return res.status(404).render("404", { pageTitle: "404ErrorPage", mainContent: "User not found." });
  }
  return res.render("users/profile", { pageTitle: `Profile of ${user.name}`, user });
};
