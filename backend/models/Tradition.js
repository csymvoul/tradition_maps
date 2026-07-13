const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Tradition = sequelize.define('Tradition', {
  name:                { type: DataTypes.STRING, allowNull: false },
  description:         { type: DataTypes.TEXT },
  detailedDescription: { type: DataTypes.TEXT },
  category: {
    type: DataTypes.ENUM('festival', 'museum', 'church', 'music', 'dance', 'food', 'custom'),
    defaultValue: 'custom'
  },
  image:        { type: DataTypes.TEXT },
  youtube:      { type: DataTypes.TEXT },
  google:       { type: DataTypes.TEXT },
  visitgreece:  { type: DataTypes.TEXT }
}, {
  tableName: 'traditions',
  timestamps: false
});

module.exports = Tradition;
