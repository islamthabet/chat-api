export enum RoomEvents {
  ROOM_CREATED = 'room.create',
  ROOM_DELETE = 'room.delete',
}

export class RoomCreateEvent {
  constructor(member: string, waitingApprove: Array<string>, room: string) {
    this.waitingApprove = waitingApprove;
    this.member = member;
    this.room = room;
  }
  waitingApprove: Array<string>;
  member: string;
  room: string;
}

export class RoomDeleteEvent {
  constructor(id: string) {
    this.id = id;
  }
  id: string;
}
