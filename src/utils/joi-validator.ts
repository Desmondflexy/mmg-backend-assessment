import joi from "joi";

export const addItemLot = joi.object().keys({
    quantity: joi.number().min(1).required(),
    expiry: joi.string().required().messages({ 'string.base': 'Expiry must be a string in the format DDMMYY' }),
});

export const sellItem = joi.object().keys({
    quantity: joi.number().min(1).required(),
});