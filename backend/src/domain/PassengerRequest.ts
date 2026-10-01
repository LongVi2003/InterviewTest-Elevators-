import { Direction, RequestStatus } from './enums';

export class PassengerRequest {
  public status: RequestStatus = RequestStatus.PENDING;
  public assignedElevatorId?: string;
  public readonly createdAt = Date.now();

  constructor(
    public readonly id: string,
    public readonly floor: number,
    public readonly direction: Direction,
  ) {}

  assign(elevatorId: string): void {
    this.assignedElevatorId = elevatorId;
    this.status = RequestStatus.ASSIGNED;
  }

  pickUp(): void {
    this.status = RequestStatus.PICKED_UP;
  }

  complete(): void {
    this.status = RequestStatus.COMPLETED;
  }
}
