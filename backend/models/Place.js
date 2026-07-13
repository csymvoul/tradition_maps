const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Place = sequelize.define('Place', {
  name:        { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  region:      { type: DataTypes.STRING },
  latitude:    { type: DataTypes.FLOAT, allowNull: false },
  longitude:   { type: DataTypes.FLOAT, allowNull: false },
  image:       { type: DataTypes.TEXT }
}, {
  tableName: 'places',
  timestamps: true
});

module.exports = Place;
