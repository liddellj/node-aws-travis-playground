module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    profileId: DataTypes.STRING,
    name: DataTypes.STRING
  },{
    timestamps: false
  });

  return User;
};