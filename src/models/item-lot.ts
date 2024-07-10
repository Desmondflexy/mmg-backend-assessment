import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

interface IItemLot extends Model {
    name: string;
    quantity: number;
    expiry: number;
    id: number;
}

const ItemLot = sequelize.define<IItemLot>('ItemLot', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expiry: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
});

export default ItemLot;