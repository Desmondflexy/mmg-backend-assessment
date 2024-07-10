import { Router } from "express";
import { addLot, sellItem, getQuantity } from "../controllers/item-lot";

const router = Router();
router.post('/:item/add', addLot);
router.post('/:item/sell', sellItem);
router.get('/:item/quantity', getQuantity);

export default router;