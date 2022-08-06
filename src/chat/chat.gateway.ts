import { CallRepository } from './../calls/Call.repository';
import { UserRepository } from './../users/user.repository';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(private readonly userRepo: UserRepository, private callRepo: CallRepository) {}
  onlineUsers = new Map();

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    if (client.handshake.query.user != 'null') {
      this.onlineUsers.set(client.handshake.query.user, client.id);
      this.userRepo.editOneById(client.handshake.query.user as string, { lastSeen: true });
      client.broadcast.emit('userJoin', client.handshake.query.user);
    }
  }
  handleDisconnect(client: Socket) {
    if (client.handshake.query.user != 'null') {
      this.onlineUsers.delete(client.handshake.query.user);
      this.userRepo.editOneById(client.handshake.query.user as string, { lastSeen: new Date() });
      client.broadcast.emit('userLeft', client.handshake.query.user);
    }
  }
  afterInit(server: Server) {
    console.log('server');
  }

  @SubscribeMessage('new-user')
  newUser(client: Socket) {
    client.broadcast.emit('new-user');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { to: string; message: string }): string {
    const room = this.onlineUsers.get(payload.to);
    if (room) {
      this.server.to(room).emit('message', {
        message: payload.message,
        createdAt: new Date(),
        from: client.handshake.query.user,
      });
    }
    return payload.message;
  }

  @SubscribeMessage('notification')
  async handleNotification(client: any, payload: { to: string; notification: string }) {
    const { to, notification } = payload;
    const room = this.onlineUsers.get(to);
    if (room) {
      const user = await this.userRepo.findById(client.handshake.query.user as string);
      this.server.to(room).emit('notification', { user, notification });
    }
  }

  @SubscribeMessage('user-resource')
  handelUserResource(client: Socket, payload: any) {
    this.server.to('admin').emit('user-resource-update', payload.method);
  }

  @SubscribeMessage('friend-request')
  async friendRequest(client: Socket, to: string) {
    const room = this.onlineUsers.get(to);
    if (room) {
      const user = await this.userRepo.findById(client.handshake.query.user as string);
      this.server.to(room).emit('friend-request', user);
      this.server
        .to(room)
        .emit('notification', { user, notification: 'send friend request to you' });
    }
  }

  @SubscribeMessage('accept-friend-request')
  async acceptFriendRequest(client: Socket, to: string) {
    const room = this.onlineUsers.get(to);
    if (room) {
      const user = await this.userRepo.findById(client.handshake.query.user as string);
      this.server.to(room).emit('accept-friend-request', user);
      this.server
        .to(room)
        .emit('notification', { user, notification: 'accept your friend request' });
    }
  }

  @SubscribeMessage('reject-friend-request')
  async rejectFriendRequest(client: Socket, to: string) {
    const room = this.onlineUsers.get(to);
    if (room) {
      const user = await this.userRepo.findById(client.handshake.query.user as string);
      this.server.to(room).emit('reject-friend-request', user);
      this.server
        .to(room)
        .emit('notification', { user, notification: 'reject your friend request' });
    }
  }

  @SubscribeMessage('start-call')
  async startCall(client: Socket, payload: { to: string; from: string }) {
    const room = this.onlineUsers.get(payload.to);
    if (room) {
      const user = await this.userRepo.findById(client.handshake.query.user as string);
      this.server.to(room).emit('call-received', { from: user, peerId: payload.from });
    }
  }
  @SubscribeMessage('reject-call')
  async rejectCall(client: Socket, payload: { to: string }) {
    const room = this.onlineUsers.get(payload.to);
    if (room) {
      this.server.to(room).emit('close-call');
      this.callRepo.create({
        to: client.handshake.query.user,
        from: payload.to,
        endAt: Date.now(),
        type: 'audio',
        status: 'reject',
      });
    }
  }

  @SubscribeMessage('no-answer')
  async noAnswerToCall(client: Socket, payload: { to: string }) {
    const room = this.onlineUsers.get(payload.to);
    if (room) {
      this.server.to(room).emit('close-call');
      this.callRepo.create({
        to: client.handshake.query.user,
        from: payload.to,
        endAt: Date.now(),
        type: 'audio',
        status: 'no-answer',
      });
    }
  }

  @SubscribeMessage('no-answer')
  async cancelCall(client: Socket, payload: { to: string }) {
    const room = this.onlineUsers.get(payload.to);
    if (room) {
      this.server.to(room).emit('close-call');
      this.callRepo.create({
        to: payload.to,
        from: client.handshake.query.user,
        endAt: Date.now(),
        type: 'audio',
        status: 'reject',
      });
    }
  }
}
