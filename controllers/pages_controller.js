// GET to "/"

function homepage(req, res) {
  res.render("pages/homepage");
}

// GET to "/register"

function register(req, res) {
  res.render("pages/register")
}

module.exports = {
   homepage,
   register
  };
