'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const options = {
  dialect: 'sqlite',
  storage: 'movies.db',
  // This disables the use of string based operators
  // in order to improve the security of our code.
  operatorsAliases: false,
  // This option configures Sequelize to always force the synchronization
  // of our models by dropping any existing tables.
  sync: { force: true },
  define: {
    // This option removes the `createdAt` and `updatedAt` columns from the tables
    // that Sequelize generates from our models.
    timestamps: false,
  },
};

const sequelize = new Sequelize(options);

const models = {};

// Import all of the models.
fs
  .readdirSync(path.join(__dirname, 'models'))
  .forEach((file) => {
    console.info(`Importing database model from file: ${file}`);
    const model = sequelize.import(path.join(__dirname, 'models', file));
    models[model.name] = model;
  });

// If available, call method to create associations.
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  models,
};