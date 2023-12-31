import { subs } from '@/config/subscriptions';
import { SOCKET_URL } from '@/constants/constants';
import { WebSocketAction } from '@/enums/enums';
import { ISocketMessage } from '@/types/types';

export const connectWebSocket = (onMessage: (socketMessage: ISocketMessage) => void): void => {
  const socket = new WebSocket(`${SOCKET_URL}?api_key=${import.meta.env.VITE_API_KEY as string}`);

  socket.onopen = () => {
    console.log('WebSocket connection established.');
    socket.send(JSON.stringify({ action: WebSocketAction.SUB_ADD, subs }));
  };

  socket.onmessage = (event: MessageEvent) => {
    try {
      const socketMessage = JSON.parse(event.data as string) as ISocketMessage;
      onMessage(socketMessage);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  socket.onclose = (event) => {
    console.log('WebSocket connection closed:', event);

    setTimeout(() => {
      console.log('Reconnecting to WebSocket...');
      connectWebSocket(onMessage);
    }, 5000);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};

export const closeWebSocket = (socket: WebSocket): void => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ action: WebSocketAction.SUB_REMOVE, subs }));
  }
};
