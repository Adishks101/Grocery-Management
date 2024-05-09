import { Model, DataTypes } from "sequelize";
import sequelize from "../utility/sqlConnection";
import bcrypt from "bcryptjs";
import { Gender, UserStatus, UserType } from "../utility/customDatatypes";

interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  userType: UserType;
  status: UserStatus;
  address: string;
  phone?: string;
  profilePicture?: string;
  dob: Date;
  gender: Gender;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public userType!: UserType;
  public status!: UserStatus;
  public address!: string;
  public phone?: string;
  public profilePicture?: string;
  public dob!: Date;
  public gender!: Gender;

  public async hashPassword(): Promise<void> {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  public async softDelete(): Promise<void> {
    this.status = UserStatus.Inactive;
    await this.save();
  }

  public async banUser(): Promise<void> {
    this.status = UserStatus.Banned;
    await this.save();
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.ENUM(...Object.values(UserType)),
      allowNull: false,
      values: Object.values(UserType),
      defaultValue: UserType.User,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(UserStatus)),
      allowNull: false,
      values: Object.values(UserStatus),
      defaultValue: UserStatus.Active,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM(...Object.values(Gender)),
      allowNull: false,
      values: Object.values(Gender),
      defaultValue: Gender.Undisclosed,
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
      },
    },
  }
);

export default User;
