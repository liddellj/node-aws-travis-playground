module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    profileId: DataTypes.STRING,
    name: DataTypes.STRING
  });

  return User;
};