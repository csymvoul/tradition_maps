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
  // Primary image (kept for backward compat / list views)
  image:       { type: DataTypes.TEXT },
  // Gallery — array of image URLs stored as JSONB
  images:      { type: DataTypes.JSONB, defaultValue: [] },
  youtube:     { type: DataTypes.TEXT },
  google:      { type: DataTypes.TEXT },
  visitgreece: { type: DataTypes.TEXT }
}, {
  tableName: 'traditions',
  timestamps: false
});

module.exports = Tradition;
