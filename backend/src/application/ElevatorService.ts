import { randomUUID } from 'node:crypto';
import { Direction, RequestStatus } from '../domain/enums';
import { Elevator } from '../domain/Elevator';
import { PassengerRequest } from '../domain/PassengerRequest';
import { DispatchService } from './DispatchService';
import { InMemoryStore } from '../infrastructure/InMemoryStore';

export class ElevatorService {
  constructor(
    private readonly store: InMemoryStore,
    private readonly dispatchService: DispatchService,
  ) {}

  requestElevator(floor: number, direction: Direction): PassengerRequest {
    this.validateRequest(floor, direction);

    const request = new PassengerRequest(randomUUID(), floor, direction);
    this.store.requests.set(request.id, request);
    this.tryAssign(request);
    return request;
  }

  addDestination(elevatorId: string, floor: number): Elevator {
    const elevator = this.getElevator(elevatorId);
    elevator.addDestination(floor);
    return elevator;
  }

  openDoor(elevatorId: string): Elevator {
    const elevator = this.getElevator(elevatorId);
    elevator.openDoor();
    return elevator;
  }

  holdDoor(elevatorId: string): Elevator {
    const elevator = this.getElevator(elevatorId);
    elevator.holdDoorOpen();
    return elevator;
  }

  closeDoor(elevatorId: string): Elevator {
    const elevator = this.getElevator(elevatorId);
    elevator.closeDoor();
    return elevator;
  }

  tick(): void {
    for (const elevator of this.store.elevators.values()) {
      // processNextStep() trả về tầng đã đến (nếu có sự kiện đến tầng)
      const arrivedFloor = elevator.processNextStep();
      if (arrivedFloor !== null) {
        this.handleArrival(elevator, arrivedFloor);
      }
    }

    // Thử phân công lại các request vẫn đang PENDING
    for (const request of this.store.requests.values()) {
      if (request.status === RequestStatus.PENDING) {
        this.tryAssign(request);
      }
    }
  }

  getState() {
    return {
      elevators: [...this.store.elevators.values()].map((e) => e.getSnapshot()),
      requests: [...this.store.requests.values()].map((r) => ({
        id: r.id,
        floor: r.floor,
        direction: r.direction,
        status: r.status,
        assignedElevatorId: r.assignedElevatorId,
        createdAt: r.createdAt,
      })),
    };
  }

  reset(): void {
    this.store.clear();
    this.store.elevators.set('E1', new Elevator('E1', 1));
    this.store.elevators.set('E2', new Elevator('E2', 5));
    this.store.elevators.set('E3', new Elevator('E3', 10));
  }

  /**
   * FIX: Xử lý lifecycle request khi thang đến tầng:
   * - ASSIGNED → PICKED_UP: thang đến tầng mà hành khách đang chờ
   * - PICKED_UP → COMPLETED: thang đến tầng đích mà hành khách muốn đến
   *   (tầng đích được thêm thủ công qua addDestination sau khi đón)
   */
  private handleArrival(elevator: Elevator, arrivedFloor: number): void {
    const snapshot = elevator.getSnapshot();

    for (const requestId of snapshot.assignedRequests) {
      const request = this.store.requests.get(requestId);
      if (!request) continue;

      if (request.status === RequestStatus.ASSIGNED && request.floor === arrivedFloor) {
        // Thang đến tầng mà hành khách đang đợi → đón hành khách
        request.pickUp();
      } else if (request.status === RequestStatus.PICKED_UP) {
        // Hành khách đã lên → thang đến tầng nào cũng là tầng đích của họ
        // (vì sau khi đón, hành khách sẽ bấm tầng đến qua UI → addDestination)
        // Khi thang mở cửa ở tầng tiếp theo, coi như hoàn thành
        request.complete();
        elevator.removeRequest(requestId);
      }
    }
  }

  private tryAssign(request: PassengerRequest): void {
    if (request.status !== RequestStatus.PENDING) return;

    const elevator = this.dispatchService.findBestElevator(
      request,
      [...this.store.elevators.values()],
    );

    if (!elevator) return;

    request.assign(elevator.id);
    elevator.assignRequest(request.id);
    elevator.addDestination(request.floor);
  }

  private getElevator(id: string): Elevator {
    const elevator = this.store.elevators.get(id);
    if (!elevator) throw new Error(`Elevator ${id} not found`);
    return elevator;
  }

  private validateRequest(floor: number, direction: Direction): void {
    if (!Number.isInteger(floor) || floor < 1 || floor > 10) {
      throw new Error('Floor must be between 1 and 10');
    }

    if (floor === 1 && direction === Direction.DOWN) {
      throw new Error('Floor 1 cannot request DOWN');
    }

    if (floor === 10 && direction === Direction.UP) {
      throw new Error('Floor 10 cannot request UP');
    }
  }
}
