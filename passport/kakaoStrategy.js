const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

const { User } = require("../models");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("kakao profile:", profile);

        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: "kakao" },
          });

          if (!exUser) {
            const newUser = await User.create({
              email: profile._json?.kakao_account?.email,
              nick: profile.displayName,
              snsId: profile.id,
              provider: "kakao",
            });
            return done(null, newUser);
          }

          done(null, exUser);
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
