import React, { useEffect, useState } from 'react';
import { apiEndpoints } from '../services/api';
import './styles/queue.css';

const Queue = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch Data
  const fetchQueue = async () => {
    try {
        const response = await apiEndpoints.orders.getQueue();
        if (response.data && response.data.success) {
            setOrders(response.data.data);
        }
    } catch (error) {
        console.error("Failed to fetch queue:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 10000);  // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [])

  // Status Update
  const handleStatusUpdate = async (GrOrderedList, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 2 : 3;

    try {
        await apiEndpoints.orders.updateStatus(GrOrderedList, nextStatus);
        fetchQueue();
    } catch (error) {
        alert("failed to update status. Check console.");
        console.error(error);
    }
  };

  const pendingCount = orders.filter(o => o.status_id === 1).length;
  const preparingCount = orders.filter(o => o.status_id === 2).length;
  const totalCount = orders.length;

  if (loading) return <div className="queue-loading">Loading...</div>

  return (
    // --- Summary Header ---
    <div className='queue-header'>
        <div className='summary-container'>
            <span className='summary-header'>TOTAL IN QUEUE</span>
            <span className='summary-content'>{totalCount}</span>
        </div>
        <div className='summary-container'>
            <span className='summary-header'>QUEUED</span>
            <span className='summary-content'>{pendingCount}</span>
        </div>
        <div className='summary-container'>
            <span className='summary-header'>PREAPARING</span>
            <span className='summary-content'>{preparingCount}</span>
        </div>
        <div className='summary-container'>
            <span className='summary-header'>READY FOR PICKUP</span>
            <span className='summary-content'>XXX</span>
        </div>
    </div>
  )
}

export default Queue