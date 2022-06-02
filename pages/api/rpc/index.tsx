import { createRpcRoom, getNonPrivateRpcRooms } from 'api/server/controller';
import { NextApiRequest } from 'next';
import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const SocketHandler = (req: NextApiRequest, res: any) => {
  let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  if (res.socket!.server.io) {
    // Socket is already running
  } else {
    // Initialize socket
    io = new Server(res.socket.server);
    io.on('connect', async (socket) => {
      let rooms = await getNonPrivateRpcRooms();
      // get rooms on init
      io.emit('get-rooms', { rooms });
      // update rooms list on creation event
      socket.on('create-room', async (data) => {
        const { access, owner } = data;
        const r = await createRpcRoom(access, owner);
        if (!r.error && access) {
          rooms = await getNonPrivateRpcRooms();
          // get updated rooms
          io.emit('get-rooms', { rooms });
        }
      });
    });
    res.socket.server.io = io;
  }

  res.end();
};

export default SocketHandler;
