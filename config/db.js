const Sequelize = require('sequelize');
require('dotenv').config({ path: 'variables.env'})

const db = new Sequelize(
  process.env.BD_NOMBRE,
  rocess.env.USER, 
  rocess.env.PASS, 
  {
  host: rocess.env.BD_HOST,
  dialect: 'mysql',
  port: rocess.env.BD_PORT,
  define: {
      timestamps: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = db;