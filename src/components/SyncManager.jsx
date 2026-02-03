import React, { useEffect, useState } from 'react';
import useServerStatus from '../hooks/useServerStatus';
import { OfflineQueue } from '../services/OfflineQueue';
import { apiEndpoints } from '../services/api';

const SyncManager = () => {
    const isSystemOnline = useServerStatus();
    const [ isSyncing, setIsSyncing ] = useState(false);
    const [ pendingCount, setPendingCount ] = useState(0);

    // 1. Update count safely
    useEffect(() => {
        const updateCount = async () => {
            try {
                // FIX A: Added 'await' so we don't get a Promise error
                const count = await OfflineQueue.count();
                setPendingCount(count);
            } catch (error) {
                console.error("Error counting queue:", error);
                setPendingCount(0);
            }
        };

        updateCount();
        const interval = setInterval(updateCount, 2000);
        return () => clearInterval(interval);
    }, []);

    // 2. Auto-Sync Logic
    useEffect(() => {
        if (isSystemOnline && !isSyncing && pendingCount > 0) {
            processQueue();
        }
    }, [isSystemOnline, pendingCount]);

    const processQueue = async () => {
        if(isSyncing) return;
        setIsSyncing(true);

        try {
            // FIX B: Added 'await' here. THIS WAS CAUSING THE CRASH!
            const queue = await OfflineQueue.getAll();
            console.log(`Starting sync for ${queue.length} orders...`);

            for (const order of queue) {
                try {
                    const response = await apiEndpoints.orders.sync(order);

                    if (response.status === 200 || response.status === 201) {
                        console.log("✅ Synced success:", order.offline_uuid);
                        await OfflineQueue.remove(order.offline_uuid);
                        setPendingCount(prev => Math.max(0, prev - 1));
                    }
                } catch (error) {
                    console.error("❌ SYNC FAILED for order:", order.offline_uuid);
                    // If offline, just stop trying for now. No need to crash.
                    break; 
                }
            }
        } catch (error) {
            console.error("Queue processing error:", error);
        } finally {
            setIsSyncing(false);
        }
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
                <button onClick={processQueue} style={{ color: 'black', cursor: 'pointer', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>
                    Retry
                </button>
            )}
        </div>
    );
}

export default SyncManager;