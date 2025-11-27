const passport = require("passport");

const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");

const { User } = require("../models");

module.exports = () => {
  // 로그인 시도 시 실행
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 매 요청 시 실행 (passport.session 미들웨어가 이 메서드를 호출)
  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followers",
        },
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followings",
        },
      ],
    })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
  kakao();
};
