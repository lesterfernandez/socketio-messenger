module.exports.isAuth = (req, res, next) => {
  if (req.session.user && req.session.user.id) {
    next();
  } else {
    res.json({ loggedIn: false });
  }
};
