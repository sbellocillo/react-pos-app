import React, { useEffect, useState } from 'react';
import useServerStatus from '../hooks/useServerStatus';
import { OfflineQueue } from '../services/OfflineQueue';
import { apiEndpoints } from '../services/api';

const SyncManager = () => {
    const isSystemOnline = useServerStatus();
    const [ isSyncing, setIsSyncing ] = useState(false);
    const [ pendingCount, setPendingCount ] = useState(0);

    // 1. Update count immediately and every 2 seconds
    useEffect(() => {
        const updateCount = () => setPendingCount(OfflineQueue.count());
        updateCount();
        const interval = setInterval(updateCount, 2000);
        return () => clearInterval(interval);
    }, []);

    // 2. Auto-Sync Logic
    useEffect(() => {
        // Only sync if online, not currently syncing, and there are items waiting
        if (isSystemOnline && !isSyncing && pendingCount > 0) {
            processQueue();
        }
    }, [isSystemOnline, pendingCount]);

    const processQueue = async () => {
        if(isSyncing) return;
        setIsSyncing(true);

        const queue = OfflineQueue.getAll();
        console.log(`Starting sync for ${queue.length} orders...`);

        for (const order of queue) {
            try {
                // Send to backend
                const response = await apiEndpoints.orders.sync(order);

                // If successful (200 OK or 201 Created)
                if (response.status === 200 || response.status === 201) {
                    console.log("✅ Synced success:", order.offline_uuid);
                    OfflineQueue.remove(order.offline_uuid);
                    setPendingCount(prev => prev - 1);
                }
            } catch (error) {
                // 🛑 THIS IS WHERE THE ANSWER IS
                console.error("❌ SYNC FAILED:", error);
                
                if (error.response) {
                    // The server responded with a specific error message
                    console.error("SERVER REASON:", error.response.data);
                    alert(`Sync Error: ${JSON.stringify(error.response.data)}`); 
                } else {
                    console.error("NETWORK REASON:", error.message);
                }
                
                // Stop the loop so we don't hammer the server if it's broken
                break;
            }
        }
        setIsSyncing(false);
    };

    if (pendingCount === 0) return null;

    return (
        <div style={{
            position: 'fixed', bottom: 20, right: 20,
            backgroundColor: isSystemOnline ? '#4caf50' : '#ff9800',
            color: 'white', padding: '10px 20px', borderRadius: '8px',
            zIndex: 9999, display: 'flex', alignItems: 'center', gap: '10px'
        }}>
            <span>
                {isSystemOnline ? 'Syncing...' : 'Offline Mode'} 
                <strong> ({pendingCount} pending)</strong>
            </span>
            {isSystemOnline && !isSyncing && (
                <button onClick={processQueue} style={{ color: 'black', cursor: 'pointer' }}>
                    Retry
                </button>
            )}
        </div>
    );
}

export default SyncManager;