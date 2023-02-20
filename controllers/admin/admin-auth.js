const Admin = require("../../models/admin-schema");
module.exports = {
  checkEmail: async (email) => {
    let dbAdmin = await Admin.findOne({ email: email });
    return dbAdmin;
  },
  comparePassword: async (password, email) => {
    let admin = await Admin.findOne({ email: email });
    if (password == admin.password) {
      return true;
    }
  },
  validatePassword: (password, confirmPassword) => {
    if (password === confirmPassword) {
      return true;
    } else {
      return false;
    }
  },
};
