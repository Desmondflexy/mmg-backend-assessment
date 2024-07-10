import { Request, Response } from "express";
import ItemLot from "../models/item-lot";
import { getExpiryDate } from "../utils/helper";
import * as joi from '../utils/joi-validator';
import { Op } from "sequelize";

export async function addLot(req: Request, res: Response) {
    try {
        const name = req.params.item;
        if (!name) return res.status(400).json({ message: 'Item name is required in request params' });

        const { error } = joi.addItemLot.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        const { quantity, expiry } = req.body;
        const result = getExpiryDate(expiry);
        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        const itemLot = await ItemLot.create({ name, quantity, expiry: result.expiry });
        return res.status(201).json(itemLot);

    } catch (error) {
        console.error('Error adding item lot', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function sellItem(req: Request, res: Response) {
    try {
        const name = req.params.item;
        if (!name) return res.status(400).json({ message: 'Item name is required in request params' });

        const { error } = joi.sellItem.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        let quantity = req.body.quantity;

        const now = new Date().getTime();

        const item = await ItemLot.findOne({ where: { name, expiry: { [Op.gt]: now } } });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        const itemLots = await ItemLot.findAll({ where: { name, expiry: { [Op.gt]: now } }, order: [['expiry', 'ASC']] });
        const totalQty = await ItemLot.sum('quantity', { where: { name, expiry: { [Op.gt]: now } } });

        if (totalQty < quantity) {
            return res.status(400).json({ message: 'Not enough quantity available for this item to sell' });
        }
        for (const itemLot of itemLots) {
            if (itemLot.quantity > quantity) {
                itemLot.quantity -= quantity;
                await itemLot.save();
                quantity = 0;
            } else {
                quantity -= itemLot.quantity;
                await itemLot.destroy();
            }
            if (quantity === 0) break;
        }

        return res.json({
            message: `Sold ${req.body.quantity} quantities of ${name} successfully`,
        });
    } catch (error) {
        console.error('Error selling item', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function clearExpiredItems() {
    try {
        const now = new Date().getTime();
        await ItemLot.destroy({ where: { expiry: { [Op.lt]: now } } });
    } catch (error) {
        console.error('Error clearing expired items', error);
    }
}

export async function getQuantity(req: Request, res: Response) {
    try {
        const name = req.params.item;
        if (!name) return res.status(400).json({ message: 'Item name is required in request params' });

        const now = new Date().getTime();
        const totalQty = await ItemLot.sum('quantity', { where: { name, expiry: { [Op.gt]: now } } });
        const validTill = await ItemLot.min('expiry', { where: { name, expiry: { [Op.gt]: now } } });

        return res.json({
            quantity: Number(totalQty),
            validTill: totalQty ? validTill : null
        });
    } catch (error) {
        console.error('Error getting quantity of item', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}