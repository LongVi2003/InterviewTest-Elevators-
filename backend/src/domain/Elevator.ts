import { Door } from './Door';
import { Direction, DoorState, ElevatorState } from './enums';
import { PassengerRequest } from './PassengerRequest';

export interface ElevatorSnapshot {
  id: string;
  currentFloor: number;
  direction: Direction;
  state: ElevatorState;
  doorState: DoorState;
  destinations: number[];
  assignedRequests: string[];
}

// Số ticks cửa tự động mở trước khi tự đóng (1 tick = 1 giây)
const DOOR_OPEN_TICKS = 3;

export class Elevator {
  private direction: Direction = Direction.IDLE;
  private state: ElevatorState = ElevatorState.IDLE;
  private readonly door = new Door();
  private destinations: number[] = [];
  private assignedRequests: string[] = [];
  /** Đếm số tick cửa đã mở; -1 = cửa bị giữ thủ công (không tự đóng) */
  private doorOpenTicks = 0;

  constructor(
    public readonly id: string,
    private currentFloor: number,
    private readonly minFloor = 1,
    private readonly maxFloor = 10,
  ) {}

  canServe(request: PassengerRequest): boolean {
    if (this.state === ElevatorState.DOOR_OPEN) return false;

    if (this.direction === Direction.IDLE) return true;

    if (this.direction === Direction.UP) {
      return request.direction === Direction.UP && request.floor >= this.currentFloor;
    }

    return request.direction === Direction.DOWN && request.floor <= this.currentFloor;
  }

  addDestination(floor: number): void {
    this.validateFloor(floor);
    if (this.destinations.includes(floor)) return;

    this.destinations.push(floor);
    this.updateDirection();
    this.state = ElevatorState.MOVING;
  }

  assignRequest(requestId: string): void {
    if (!this.assignedRequests.includes(requestId)) {
      this.assignedRequests.push(requestId);
    }
  }

  removeRequest(requestId: string): void {
    this.assignedRequests = this.assignedRequests.filter((id) => id !== requestId);
  }

  /**
   * Trả về tầng thang vừa đến (để ElevatorService xử lý lifecycle request).
   * Trả về null nếu không có sự kiện đặc biệt.
   */
  processNextStep(): number | null {
    // Nếu cửa đang mở: đếm tick và tự đóng sau DOOR_OPEN_TICKS giây
    if (this.door.getState() === DoorState.OPEN) {
      if (this.doorOpenTicks >= 0) {
        // chế độ tự động (không bị hold thủ công)
        this.doorOpenTicks++;
        if (this.doorOpenTicks >= DOOR_OPEN_TICKS) {
          this.closeDoor();
        }
      }
      // doorOpenTicks === -1: đang bị giữ thủ công, không tự đóng
      return null;
    }

    if (this.destinations.length === 0) {
      this.direction = Direction.IDLE;
      this.state = ElevatorState.IDLE;
      return null;
    }

    const target = this.destinations[0];

    if (this.currentFloor === target) {
      // Đến tầng đích: mở cửa, trả về tầng đã đến
      const arrivedFloor = this.currentFloor;
      this.destinations.shift();
      this.openDoor();
      if (this.destinations.length === 0) {
        this.direction = Direction.IDLE;
      } else {
        this.updateDirection();
      }
      return arrivedFloor;
    }

    // Fix bug direction: di chuyển 1 tầng trước, rồi tính direction dựa trên vị trí mới vs target
    this.currentFloor += this.currentFloor < target ? 1 : -1;
    this.direction = target > this.currentFloor ? Direction.UP : Direction.DOWN;
    this.state = ElevatorState.MOVING;
    return null;
  }

  openDoor(): void {
    this.door.open();
    this.doorOpenTicks = 0; // bắt đầu đếm tự động
    this.state = ElevatorState.DOOR_OPEN;
  }

  holdDoorOpen(): void {
    this.door.holdOpen();
    this.doorOpenTicks = -1; // -1 = giữ thủ công, không tự đóng
    this.state = ElevatorState.DOOR_OPEN;
  }

  closeDoor(): void {
    this.door.close();
    this.doorOpenTicks = 0;
    if (this.destinations.length > 0) {
      this.state = ElevatorState.MOVING;
      this.updateDirection();
    } else {
      this.state = ElevatorState.IDLE;
      this.direction = Direction.IDLE;
    }
  }

  getCurrentFloor(): number {
    return this.currentFloor;
  }

  getDirection(): Direction {
    return this.direction;
  }

  getState(): ElevatorState {
    return this.state;
  }

  getDestinations(): number[] {
    return [...this.destinations];
  }

  getSnapshot(): ElevatorSnapshot {
    return {
      id: this.id,
      currentFloor: this.currentFloor,
      direction: this.direction,
      state: this.state,
      doorState: this.door.getState(),
      destinations: [...this.destinations],
      assignedRequests: [...this.assignedRequests],
    };
  }

  private updateDirection(): void {
    const target = this.destinations[0];
    if (target === undefined || target === this.currentFloor) {
      this.direction = Direction.IDLE;
      return;
    }
    this.direction = target > this.currentFloor ? Direction.UP : Direction.DOWN;
  }

  private validateFloor(floor: number): void {
    if (!Number.isInteger(floor) || floor < this.minFloor || floor > this.maxFloor) {
      throw new Error(`Floor must be between ${this.minFloor} and ${this.maxFloor}`);
    }
  }
}
