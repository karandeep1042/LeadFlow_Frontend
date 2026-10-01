import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAccessToken } from '../services/api/tokenStorage';
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  subscribeToSocketEvent,
} from '../services/socket/socketService';

export const useSocket = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, brokerageId } = useSelector((state) => state.auth);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = getAccessToken();

    if (isAuthenticated && token) {
      const socket = connectSocket(token, dispatch, user);

      if (socket) {
        setIsConnected(socket.connected);

        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);

        return () => {
          socket.off('connect', handleConnect);
          socket.off('disconnect', handleDisconnect);
        };
      }
    } else {
      disconnectSocket();
      setIsConnected(false);
    }
  }, [isAuthenticated, user?._id, user?.id, brokerageId, dispatch]);

  return {
    socket: getSocket(),
    isConnected,
    subscribeToSocketEvent,
  };
};

export default useSocket;
