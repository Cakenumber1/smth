import {
  addRoomMember,
  createRpcRoom,
  deleteRpcRoom,
  removeRoomMember,
  serverEventEmitter as server,
} from 'api/server/controller';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { getAndEmit } from 'util/helpers';

// todo: rewrite getAndEmit except interval deletion
const SocketHandler = (req: NextApiRequest, res: NextApiResponse & { socket: any }) => {
  // type of socket ? (not Socket)
  let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  if (res.socket!.server.io) {
    // Socket is already running
  } else {
    // Initialize socket
    io = new Server(res.socket.server);
    io.on('connect', async (socket) => {
      await getAndEmit(io);
      // listen to server interval deletion event to upd rooms for connected users
      server.on('invterval-rooms-deleted', async () => {
        await getAndEmit(io);
      });
      // update rooms members on joining/leaving
      socket.on('create-room', async (data) => {
        const { access, owner } = data;
        const r = await createRpcRoom(access, owner);
        if (!r.error && access) {
          await getAndEmit(io);
        }
      });
      // update rooms list on creation event
      socket.on('join-room', async (data) => {
        const { rid, uid } = data;
        await addRoomMember(uid, rid);
        await getAndEmit(io);
      });
      socket.on('leave-room', async (data) => {
        const { rid, uid } = data;
        await removeRoomMember(uid, rid);
        await getAndEmit(io);
      });
      // update rooms list on deletion event
      socket.on('delete-room', async (data) => {
        const { rid } = data;
        await deleteRpcRoom(rid);
        await getAndEmit(io);
      });
    });
    res.socket.server.io = io;
  }

  res.end();
};

export default SocketHandler;
