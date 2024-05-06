import { Model, DataTypes } from 'sequelize';
import sequelize from '../utility/sqlConnection';
import Order from './Order';
import GroceryItem from './GroceryItem';

class OrderItem extends Model {

}

OrderItem.init(
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, 
    },
  },
  {
    sequelize,
    modelName: 'orderItem',
  }
);

OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });
OrderItem.belongsTo(GroceryItem,{foreignKey:"groceryItemId", as: "groceryItem"});

export default OrderItem;
