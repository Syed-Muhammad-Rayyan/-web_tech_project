import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('WebsocketGateway');
  
  // Track active connections by socket ID mapping to user rooms
  private activeConnections = new Map<string, { userId: string; role: string }>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.activeConnections.delete(client.id);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string; role: string },
  ) {
    const { userId, role } = payload;
    if (!userId || !role) return;

    // Join room for this specific user ID
    client.join(userId);
    // Join room for this specific role
    client.join(role);
    // Join combined room
    client.join(`${userId}-${role}`);

    this.activeConnections.set(client.id, { userId, role });
    this.logger.log(`User ${userId} with role ${role} joined socket rooms.`);
    
    client.emit('joined', { status: 'success', rooms: Array.from(client.rooms) });
  }

  // Method to send notification to a specific user's room
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(userId).emit(event, data);
  }

  // Method to send notification to a specific role's room
  sendToRole(role: string, event: string, data: any) {
    this.server.to(role).emit(event, data);
  }

  // Method to send notification to all clients in a specific conversation room
  sendToRoom(roomName: string, event: string, data: any) {
    this.server.to(roomName).emit(event, data);
  }
}
