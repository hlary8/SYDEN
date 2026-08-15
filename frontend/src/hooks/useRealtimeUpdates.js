// frontend/src/hooks/useRealtimeUpdates.js
import { useEffect, useCallback, useRef } from 'react';
import {
  subscribeToLivestockUpdates,
  subscribeToProduceUpdates,
  subscribeToNewsUpdates,
  subscribeToLandUpdates,
  unsubscribeFromLivestockUpdates,
  unsubscribeFromProduceUpdates,
  unsubscribeFromNewsUpdates,
  unsubscribeFromLandUpdates,
  initializeSocket
} from '../services/realtimeService';

/**
 * Hook to enable real-time updates without page refresh
 * Usage:
 *   const { data, isLoading } = useRealtimeUpdates('livestock', fetchFunction);
 *   
 * @param {string} type - 'livestock', 'produce', 'news', or 'land'
 * @param {function} fetchFunction - Async function to fetch initial data
 * @param {function} onUpdate - Optional callback when data updates
 */
export const useRealtimeUpdates = (type, fetchFunction, onUpdate) => {
  const dataRef = useRef([]);
  const callbackRef = useRef(null);

  // Initialize socket on mount
  useEffect(() => {
    initializeSocket();
  }, []);

  // Setup real-time listeners
  useEffect(() => {
    const handleUpdate = (updatedItem) => {
      // Update local data
      if (Array.isArray(dataRef.current)) {
        const index = dataRef.current.findIndex(item => item._id === updatedItem._id);
        if (index >= 0) {
          dataRef.current[index] = updatedItem;
        } else {
          dataRef.current.unshift(updatedItem);
        }
      }
      
      // Trigger callback to update component state
      if (callbackRef.current) {
        callbackRef.current([...dataRef.current]);
      }
      
      // User-provided callback
      if (onUpdate) {
        onUpdate(updatedItem, type);
      }
    };

    const handleDelete = (deletedItem) => {
      if (Array.isArray(dataRef.current)) {
        dataRef.current = dataRef.current.filter(item => 
          item._id !== (deletedItem._id || deletedItem.ok)
        );
      }
      
      if (callbackRef.current) {
        callbackRef.current([...dataRef.current]);
      }
      
      if (onUpdate) {
        onUpdate(deletedItem, `${type}:deleted`);
      }
    };

    // Subscribe based on type
    if (type === 'livestock') {
      subscribeToLivestockUpdates(handleUpdate);
      subscribeToLivestockUpdates(handleDelete);
    } else if (type === 'produce') {
      subscribeToProduceUpdates(handleUpdate);
      subscribeToProduceUpdates(handleDelete);
    } else if (type === 'news') {
      subscribeToNewsUpdates(handleUpdate);
      subscribeToNewsUpdates(handleDelete);
    } else if (type === 'land') {
      subscribeToLandUpdates(handleUpdate);
      subscribeToLandUpdates(handleDelete);
    }

    // Cleanup
    return () => {
      if (type === 'livestock') {
        unsubscribeFromLivestockUpdates(handleUpdate);
        unsubscribeFromLivestockUpdates(handleDelete);
      } else if (type === 'produce') {
        unsubscribeFromProduceUpdates(handleUpdate);
        unsubscribeFromProduceUpdates(handleDelete);
      } else if (type === 'news') {
        unsubscribeFromNewsUpdates(handleUpdate);
        unsubscribeFromNewsUpdates(handleDelete);
      } else if (type === 'land') {
        unsubscribeFromLandUpdates(handleUpdate);
        unsubscribeFromLandUpdates(handleDelete);
      }
    };
  }, [type, onUpdate]);

  /**
   * Method to set callback for data updates
   * Should be called from component when state updates
   */
  const setDataAndCallback = useCallback((data, callback) => {
    dataRef.current = data || [];
    callbackRef.current = callback;
  }, []);

  return { setDataAndCallback };
};
