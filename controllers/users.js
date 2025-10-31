const User = require("../models/user.js");

// Register User

module.exports.registerUser = async (req, res, next) => {
  try {
    let { username, password, email } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// Render Login Form

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// User loggedIn

module.exports.loggedIn = async (req, res) => {
  req.flash("success", "Welcome back to your account");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// User logout

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out !");
    res.redirect("/listings");
  });
};
