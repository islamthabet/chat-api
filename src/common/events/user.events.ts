export enum UserEvents {
  USER_CREATE = 'user.create',
  USER_DELETE = 'user.delete',
  USER_SEND_REQUEST = 'user.request',
  USER_ACCEPT_REQUEST = 'user.accept',
  USER_REJECT_REQUEST = 'user.reject',
}

export class UserCreateEvent {
  constructor(id: string) {
    this.id = id;
  }
  private id: string;
}
export class UserDeleteEvent {
  constructor(id: string) {
    this.id = id;
  }
  id: string;
}
export class UserSendFriendRequestEvent {
  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }
  from: string;
  to: string;
}
export class UserAcceptFriendRequestEvent {
  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }
  from: string;
  to: string;
}
export class UserRejectFriendRequestEvent {
  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }
  from: string;
  to: string;
}
