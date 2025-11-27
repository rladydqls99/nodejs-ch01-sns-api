const { User, Post, Hashtag } = require("../models");

exports.renderProfile = (_req, res) => {
  return res.render("profile", { title: "내 프로필" });
};

exports.renderJoin = (_req, res) => {
  return res.render("join", { title: "회원가입" });
};

exports.renderMain = (_req, res, next) => {
  try {
    const posts = Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]],
    });

    return res.render("main", {
      title: "SNS Service",
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.renderHashtag = async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) return res.redirect("/");

  try {
    const hashtag = Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }

    return res.render("main", {
      title: `${query} | SNS Service`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
