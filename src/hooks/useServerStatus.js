import { useState, useEffect } from 'react';
import { apiEndpoints } from '../services/api';

const useServerStatus = () => {
    // Default to browser status
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isServerReachable, setIsServerReachable] = useState(true);

    // 1. Browser Network Check (Instant - detects if cable is unplugged)
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // 2. Server Heartbeat Check (With Timeout)
    useEffect(() => {
        // If the browser knows we are offline, don't bother checking server
        if (!isOnline) {
            return; 
        }

        const checkServer = async () => {
            try {
                // Create a generic timeout that fails after 2 seconds
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Request timed out')), 2000)
                );

                // Race the API call against the timeout
                // Whichever finishes first wins
                await Promise.race([
                    apiEndpoints.system.checkHealth(),
                    timeoutPromise
                ]);

                setIsServerReachable(true);
            } catch (error) {
                // If it fails OR times out, we are offline
                console.warn("Heartbeat failed:", error.message);
                setIsServerReachable(false);
            }
        };

        // Check immediately on load
        checkServer();
        
        // Then check every 5 seconds
        const interval = setInterval(checkServer, 5000);

        return () => clearInterval(interval);
    }, [isOnline]); // Re-run if browser status changes
    
    // Return TRUE only if BOTH are happy
    return isOnline && isServerReachable;
};

export default useServerStatus;