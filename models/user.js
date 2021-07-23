"use strict";
const { Model, UUID, UUIDV4 } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post }) {
      // define association here
      this.hasMany(Post, { foreignKey: "userId", as: "posts" });
    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined
      };
    }
  }
  user.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "User must have a name"
          },
          notEmpty: {
            msg: "Name cannot be empty"
          }
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "User must have a username"
          },
          notEmpty: {
            msg: "Username cannot be empty"
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "User must have an email"
          },
          notEmpty: {
            msg: "Email cannot be empty"
          },
          isEmail: {
            msg: "must be a valid email address"
          }
        },
        unique: {
          args: true,
          msg: "Email address already in use!"
        }
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "User must have an role"
          },
          notEmpty: {
            msg: "Role cannot be empty"
          }
        }
      }
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User"
    }
  );
  return user;
};
