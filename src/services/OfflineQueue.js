import { database } from "../db";
import { Q } from '@nozbe/watermelondb';

export const OfflineQueue = {
    // Save order
    add: async (orderPayload) => {
        try {
            await database.write(async () => {
                await database.get('offline_orders').create(record => {
                    record.offline_uuid = orderPayload.offline_uuid;
                    record.payload = JSON.stringify(orderPayload);
                    record.created_at = new Date();
                });
            });
            return true;
        } catch (error) {
            console.error("DB Save Failed:", error);
            return false;
        }
    },

    // Get all
    getAll: async () => {
        try {
            const records = await database.get('offline_orders').query().fetch();
            return records.map(r => JSON.parse(r.payload));
        } catch (error) {
            return [];
        }
    },

    // Remove after sync
    remove: async (uuid) => {
        await database.write(async () => {
            const records = await database.get('offline_orders').query(
                Q.where('offline_uuid', uuid)
            ).fetch();

            for (const record of records) {
                await record.markAsDeleted();
                await record.destroyPermanently();
            }
        });
    },

    count: async () => {
        return await database.get('offline_orders').query().fetchCount();
    }
};