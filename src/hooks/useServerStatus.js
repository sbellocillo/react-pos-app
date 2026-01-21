import { useState, useEffect } from 'react';
import { apiEndpoints } from '../services/api'; // 1. Import your API config

const useServerStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine); // Note: navigator.onLine (capital L)
    const [isServerReachable, setIsServerReachable] = useState(true);

    // Browser Check
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

    // Server Check
    useEffect(() => {
        if(!isOnline) return;

        const checkServer = async () => {
            try {
                // 2. Use the defined endpoint. 
                // We add a random param to bypass browser caching.
                await apiEndpoints.system.checkHealth(); 
                setIsServerReachable(true);
            } catch (error) {
                console.warn("Server unreachable"); // Optional: helpful for debugging
                setIsServerReachable(false);
            }
        };

        checkServer();
        const interval = setInterval(checkServer, 10000);

        return () => clearInterval(interval);
    }, [isOnline]);
    
    return isOnline && isServerReachable;
};

export default useServerStatus;