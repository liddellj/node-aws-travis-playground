'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return Promise.all([
      queryInterface.createTable('Users', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        profileId: Sequelize.STRING,
        name: Sequelize.STRING
      }),
      queryInterface.createTable('Crossovers', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        changes: {
          type: Sequelize.ARRAY(Sequelize.JSON),
          defaultValue: []
        },
        gain: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        }
      })]);
  },

  down: function (queryInterface) {
    return Promise.all([
      queryInterface.dropTable('Users'),
      queryInterface.dropTable('Crossovers')
    ]);
  }
};
