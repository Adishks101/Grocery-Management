import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../utility/sqlConnection";



interface GroceryItemAttributes {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  status: Status;
}

class GroceryItem
  extends Model<GroceryItemAttributes>
  implements GroceryItemAttributes
{
  public id!: number;
  public name!: string;
  public category!: string;
  public price!: number;
  public quantity!: number;
  public description?: string;
  public status!: Status;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async updateQuantity(quantity: number): Promise<void> {
    if (this.quantity - quantity < 0) {
      throw new Error("Insufficient quantity");
    }
    this.quantity -= quantity;
    await this.save();
  }
  public async addQuantity(quantity: number): Promise<void> {
    this.quantity += quantity;
    await this.save();
  }
  public async softDelete(): Promise<void> {
    this.status = Status.Inactive;
    await this.save();
  }
}

GroceryItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Price must be a decimal number.",
        },
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Quantity must be an integer.",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: "GroceryItem",
    tableName: "grocery_items",
  }
);

export default GroceryItem;
