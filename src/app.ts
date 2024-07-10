import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import itemLotRouter from './routes/item-lot';
import { syncDatabase } from './config/database';
import { checkAndClearExpiredLots } from './utils/helper';

dotenv.config();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

syncDatabase();

app.use('/', itemLotRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port '${port}' in '${process.env.NODE_ENV}' mode`);
});

checkAndClearExpiredLots();
