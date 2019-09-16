const Sequelize = require("sequelize");

const db = new Sequelize({
  dialect: "sqlite",
  storage: "users.db"
});

const Users = db.define("user", {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

const pharmacists = db.define("pharma", {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

module.exports = {
  db,
  Sequelize,
  Users,
  pharmacists
};
