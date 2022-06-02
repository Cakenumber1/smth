import { DefaultEventsMap } from '@socket.io/component-emitter';
import { getNonPrivateRpcRooms } from 'api/server/controller';
import { Server } from 'socket.io';

export const getAndEmit = async (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) => {
  const rooms = await getNonPrivateRpcRooms();
  io.emit('get-rooms', { rooms });
};
