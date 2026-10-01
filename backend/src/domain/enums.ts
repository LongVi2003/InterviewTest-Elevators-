export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  IDLE = 'IDLE',
}

export enum ElevatorState {
  IDLE = 'IDLE',
  MOVING = 'MOVING',
  DOOR_OPEN = 'DOOR_OPEN',
}

export enum DoorState {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum RequestStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  COMPLETED = 'COMPLETED',
}
