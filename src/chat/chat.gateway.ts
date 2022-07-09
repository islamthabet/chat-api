import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  onlineUsers = new Map();

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log(client.id, 'has been connect');
    this.onlineUsers.set(client.handshake.query.user, client.id);
    client.broadcast.emit('new-connection', `${client.id} has been connect`, this.onlineUsers);
    client.join(client.handshake.query.role);
  }
  handleDisconnect(client: Socket) {
    console.log(client.id, 'has been disconnect');
    this.onlineUsers.delete(client.handshake.query.user);
  }
  afterInit(server: Server) {
    console.log('server');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    const to = this.onlineUsers.get(payload.to);
    this.server.to(to).emit('message', { message: payload.message, createdAt: new Date() });
    return payload.message;
  }

  @SubscribeMessage('notify')
  handleNotification(client: any, payload: any): string {
    console.log(client.id, payload);
    return 'Hello world!';
  }

  @SubscribeMessage('user-resource')
  handelUserResource(client: Socket, payload: any) {
    this.server.to('admin').emit('user-resource-update', payload.method);
  }
}
