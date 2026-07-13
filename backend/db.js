const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://admin:secret@localhost:5432/tradition_maps', {
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;
