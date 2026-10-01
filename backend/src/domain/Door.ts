import { DoorState } from './enums';

export class Door {
  private state: DoorState = DoorState.CLOSED;

  open(): void {
    this.state = DoorState.OPEN;
  }

  close(): void {
    this.state = DoorState.CLOSED;
  }

  holdOpen(): void {
    this.state = DoorState.OPEN;
  }

  getState(): DoorState {
    return this.state;
  }
}
