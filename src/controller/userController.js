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
  // session을 초기화하는 유일한 부분.
  req.session.loggedIn = true;
  req.session.user = user;
  console.log("[UserController]req.session = ", req.session);
  return res.redirect("/");
};

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
    const existingUser = await User.findOne({ email: emailObject.email });
    console.log("existsUser = ", existingUser);
    if (existingUser) {
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect("/");
    } else {
      //DB에 해당 email을 가진 user가 없을 때
      const user = await User.create({
        email: emailObject.email,
        username: userData.login,
        password: "",
        name: userData.name,
        socialLoginOnly: true,
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
};

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See");
