const roleModel = require('../schemas/role');

module.exports = {
  async GetAllRoles() {
    return await roleModel.find();
  },

  async CreateARole(name) {
    const role = new roleModel({ name });
    return await role.save();
  }
};
