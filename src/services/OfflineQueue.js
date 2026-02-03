const QUEUE_KEY = 'offline_orders_queue';

export const OfflineQueue = {
    // Save an order to the queue
    add: (OrderPayload) => {
        try {
            // Get existing queue
            const existing = localStorage.getItem(QUEUE_KEY);
            const queue = existing ? JSON.parse(existing) : [];

            // Add new order
            queue.push(OrderPayload);

            // Save back to storage
            localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
            return true;
        } catch (error) {
            console.error("Failed to save offline order:", error);
            return false;
        }
    },

    // Get all pending orders
    getAll: () => {
        try {
            const existing = localStorage.getItem(QUEUE_KEY);
            return existing ? JSON.parse(existing) : [];
        } catch (error) {
            return [];
        }
    },

    // Remove a specific order
    remove: (offline_uuid) => {
        try {
            const existing = localStorage.getItem(QUEUE_KEY);
            if (!existing) return;

            const queue = JSON.parse(existing);
            // Filter out the synced order
            const updatedQueue = queue.filter(order => order.offline_uuid !== offline_uuid);

            localStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));
        } catch (error) {
            console.error("Failed to update queue:", error);
        }
    },

    // Count for UI
    count: () => {
        try {
            const existing = localStorage.getItem(QUEUE_KEY);
            return existing ? JSON.parse(existing).length : 0;
        } catch (error) {
            return 0;
        }
    }
};