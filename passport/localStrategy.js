const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      // req.body 에서 이메일과 비밀번호를 가져옴
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: false,
      },
      // 로그인 시도 시 실행
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });
          if (!exUser) {
            return done(null, false, { message: "가입되지 않은 회원입니다." });
          }

          const result = await bcrypt.compare(password, exUser.password);
          if (!result) {
            return done(null, false, {
              message: "비밀번호가 일치하지 않습니다.",
            });
          }

          return done(null, exUser);
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
