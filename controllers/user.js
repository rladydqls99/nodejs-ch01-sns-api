const { User } = require("../models");

exports.follow = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) return res.status(404).send("no user");

    await user.addFollowing(parseInt(req.params.id, 10));
    return res.send("success");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
