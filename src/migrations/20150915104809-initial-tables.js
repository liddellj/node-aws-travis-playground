'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Crossovers', {
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
    });
  },

  down: function (queryInterface) {
    return queryInterface.dropTable('Crossovers');
  }
};
