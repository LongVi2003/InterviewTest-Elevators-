export type Direction = 'UP' | 'DOWN' | 'IDLE';
export type ElevatorState = 'IDLE' | 'MOVING' | 'DOOR_OPEN';
export type DoorState = 'OPEN' | 'CLOSED';
export type RequestStatus = 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'COMPLETED';

export interface ElevatorSnapshot {
  id: string;
  currentFloor: number;
  direction: Direction;
  state: ElevatorState;
  doorState: DoorState;
  destinations: number[];
  assignedRequests: string[];
}

export interface PassengerRequest {
  id: string;
  floor: number;
  direction: Direction;
  status: RequestStatus;
  assignedElevatorId?: string;
  createdAt: number;
}

export interface ElevatorSystemState {
  elevators: ElevatorSnapshot[];
  requests: PassengerRequest[];
}
