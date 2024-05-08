// models/Order.ts

import { Model, DataTypes, Association } from "sequelize";
import User from "./User";
import sequelize from "../utility/sqlConnection";

interface OrderAttributes {
  id: any;
  orderDate: Date;
  totalAmount: number;
  totalItems: number;
  user?: User;
  status: Status;
 
}
class Order extends Model<OrderAttributes> implements OrderAttributes {
  public id!: number;
  public orderDate!: Date;
  public totalAmount!: number;
  public totalItems!: number;
  public readonly user?: User;
  public status!: Status;

}

Order.init(
  {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
      orderDate: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },
      totalItems: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      status:{
        type: DataTypes.ENUM(...Object.values(Status)),
        allowNull: false,
        values: Object.values(Status),
        defaultValue: Status.Active,
      }
  },
  {
    sequelize,
    modelName: "Order",
    timestamps: true,
  }
);

Order.belongsTo(User, { foreignKey: "userId", as: "user" });


export default Order;
