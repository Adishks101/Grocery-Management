import { Model, DataTypes } from "sequelize";
import sequelize from "../utility/sqlConnection";
import bcrypt from "bcryptjs";

enum UserType {
  Admin = "admin",
  User = "user",
}

interface UserAttributes {
  id?: number;
  username: string;
  email: string;
  password: string;
  userType: UserType;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public userType!: UserType;

  public async hashPassword(): Promise<void> {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.ENUM(...Object.values(UserType)),
      allowNull: false,
      values: Object.values(UserType),
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    hooks: {
        beforeCreate: async (user: User) => {
          await user.hashPassword();
        },
        beforeUpdate: async (user: User) => {
          await user.hashPassword();
        }
        
      }
  }
);

export default User;
