const {
  checkEmail,
  validatePassword,
  getEmail,
} = require("../controllers/controllers");
const { generateOtp, resendOtp } = require("../services/email-otp");

module.exports = {
  validateUser: (req, res, next) => {
    checkEmail(req.body.email).then((user) => {
      if (user) {
        return res.render("user-signup", {
          err: "Email address already exist",
        });
      } else {
        next();
      }
    });
  },
  checkPassword: (path) => {
    return async (req, res, next) => {
      let status = validatePassword(
        req.body.password,
        req.body.confirm_password
      );
      status
        ? next()
        : res.render(path, {
            err: "Password and Confirm Password should match",
          });
    };
  },
  generateOtp: (req, res, next) => {
    req.session.otpemail = req.body.email;
    generateOtp(req.body.email)
      .then((response) => {
        req.session.generatedOtp = response.otp;
        response.otp
          ? next()
          : res.render("user-signup", {
              err: "Error in generating otp, Try after sometimes",
            });
      })
      .catch((err) => {
        res.redirect("/users/signin");
      });
  },

  verifyOtp: (path) => {
    return async (req, res, next) => {
      const inputOtp = await req.body.verify_otp;
      inputOtp == req.session.generatedOtp
        ? next()
        : res.render(path, { err: "Invalid otp try again" });
    };
  },
  userObj: async (req, res, next) => {
    let userObject = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      email_verified: true,
      joined_at: new Date().getTime(),
    };
    req.app.locals.user = userObject;
    next();
  },
  regenerateOtp: (req, res, next) => {
    resendOtp(req.session.otpemail).then((response) => {
      req.session.generatedOtp = response.otp;
      response.otp
        ? next()
        : res.render("user-signup", {
            err: "Error in generating otp, Try after sometimes",
          });
    })
    .catch((err)=>{
      res.redirect('/users/signin');
    })
  },
};
