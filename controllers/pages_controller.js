// GET to "/"

function homepage(req, res) {
  res.render("pages/homepage");
}

// GET to "/register"

function register(req, res) {
  res.render("pages/register");
}

function dashboard(req, res) {
  res.render("pages/dashboard");
}

module.exports = {
   homepage,
   register,
   dashboard
};
