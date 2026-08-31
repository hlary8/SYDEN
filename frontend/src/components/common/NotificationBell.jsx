import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';

export default function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef();

  useEffect(() => {
    if (!user) return;
    const SOCKET_BASE = (axios.defaults.baseURL || window.location.origin).replace(/\/api\/v1\/?$/,'');
    const socket = io(SOCKET_BASE, { withCredentials: true });
    const room = `user:${user.id || user._id}`;
    socket.on('connect', () => {
      try { socket.emit('joinRoom', room); } catch (e) {}
    });
    socket.on('notification:new', (notif) => {
      // refresh unread list
      fetchNotifications(false);
    });

    fetchNotifications();
    // poll every 30s while open false to keep badge updated
    const iv = setInterval(() => fetchNotifications(false), 30000);
    return () => {
      clearInterval(iv);
      try { socket.disconnect(); } catch (e) {}
    };
    // eslint-disable-next-line
  }, [user]);

  async function fetchNotifications(showLoading = true) {
    try {
      const token = localStorage.getItem('accessToken');
      const { data } = await axios.get('/api/v1/users/notifications?unreadOnly=true', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const items = data.data || [];
      setNotifs(items.slice(0, 6));
      setUnreadCount(items.filter(i => !i.read).length || items.length);
    } catch (err) {
      console.error('Fetch notifications', err);
      setNotifs([]);
      setUnreadCount(0);
    }
  }

  async function openDropdown() {
    if (!user) return;
    setOpen(!open);
    if (!open) {
      // fetch and show
      await fetchNotifications();
    }
  }

  async function markRead(id) {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(`/api/v1/users/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setNotifs(notifs.filter(n => n._id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Mark read', err);
    }
  }

  if (!user) return null;

  return (
    <div className="relative">
      <button aria-label="Notifications" onClick={openDropdown} className="relative p-2 rounded-full hover:bg-gray-100">
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118.6 14.6V11a6 6 0 10-12 0v3.6c0 .538-.214 1.055-.595 1.445L4 17h11z" /></svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div ref={dropdownRef} className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b flex items-center justify-between">
            <strong>Notifications</strong>
            <button className="text-sm text-gray-500" onClick={() => { setNotifs([]); setUnreadCount(0); }}>Clear</button>
          </div>
          <div className="max-h-64 overflow-auto">
            {notifs.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No unread notifications</div>
            ) : notifs.map(n => (
              <div key={n._id} className="p-3 hover:bg-gray-50 flex items-start gap-3">
                <div className="flex-1">
                  <div className="text-sm font-semibold">{n.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{n.message}</div>
                  <div className="text-xs text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <button onClick={() => markRead(n._id)} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">Mark</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
