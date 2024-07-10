import cron from 'node-cron';
import { clearExpiredItems } from '../controllers/item-lot';

/**Returns the expiry date of a lot in milliseconds since midnight, January 1, 1970 UTC. */
export function getExpiryDate(bb: string) {
    if (typeof bb !== 'string' || bb.length !== 6) {
        return { error: "Expiry date must be in the format 'DDMMYY'" };
    }

    const dd = bb.slice(0, 2);
    const mm = bb.slice(2, 4);
    const yy = bb.slice(4, 6);
    const date = new Date(`${mm}/${dd}/${yy}`);
    console.log(new Date());
    console.log(Date.now(), new Date().getTime())
    // date.setHours(1, 44, 0, 0);
    const expiry = date.getTime();
    if (isNaN(expiry)) {
        return { error: "Invalid expiry date" };
    }
    if (expiry < Date.now()) {
        return { error: "Expiry date must be in the future" };
    }
    return { expiry };
}

/**Check for and clear expired lots from database every day at midnight*/
export function checkAndClearExpiredLots() {
    cron.schedule('0 0 * * *', () => {
        console.log('Running cron job to clear expired lots from database');
        clearExpiredItems();
    });
}