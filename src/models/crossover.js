/* eslint no-cond-assign: 0 no-console: 0 */

module.exports = function(sequelize, DataTypes) {
  var Crossover = sequelize.define('Crossover', {
    changes: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: []
    },
    gain: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: false,
    instanceMethods: {
      publish: function() {
        let change;

        while (change = this.changes.shift()) {
          this.applyChange(change);
        }

        this.changed('changes', true);
      },

      applyChange: function(change) {
        if (change.type == 'set-gain') {
          this.gain = change.gain;
        } else {
          throw new Error('Unrecognised change type.');
        }
      }
    }
  });

  return Crossover;
};