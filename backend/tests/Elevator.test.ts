import { describe, expect, it } from 'vitest';
import { Elevator } from '../src/domain/Elevator';
import { Direction } from '../src/domain/enums';
import { PassengerRequest } from '../src/domain/PassengerRequest';

describe('Elevator', () => {
  it('accepts an UP request while moving UP above current floor', () => {
    const elevator = new Elevator('E1', 1);
    elevator.addDestination(10);
    const request = new PassengerRequest('R1', 5, Direction.UP);

    expect(elevator.canServe(request)).toBe(true);
  });

  it('does not stop for a DOWN request while moving UP', () => {
    const elevator = new Elevator('E1', 1);
    elevator.addDestination(10);
    const request = new PassengerRequest('R1', 5, Direction.DOWN);

    expect(elevator.canServe(request)).toBe(false);
  });

  it('accepts a DOWN request while moving DOWN below current floor', () => {
    const elevator = new Elevator('E1', 10);
    elevator.addDestination(1);
    const request = new PassengerRequest('R1', 5, Direction.DOWN);

    expect(elevator.canServe(request)).toBe(true);
  });

  it('moves one floor per simulation step', () => {
    const elevator = new Elevator('E1', 1);
    elevator.addDestination(5);

    elevator.processNextStep();
    expect(elevator.getCurrentFloor()).toBe(2);
  });

  it('returns arrived floor when reaching destination', () => {
    const elevator = new Elevator('E1', 4);
    elevator.addDestination(5);

    elevator.processNextStep(); // bước 1: di chuyển 4 → 5
    const result = elevator.processNextStep(); // bước 2: đang ở tầng 5 = target → mở cửa, trả về 5
    expect(elevator.getCurrentFloor()).toBe(5);
    expect(result).toBe(5); // thông báo đã đến tầng 5
  });

  it('auto-closes door after 3 ticks', () => {
    const elevator = new Elevator('E1', 3);
    elevator.addDestination(3); // đang ở tầng 3, mở cửa ngay
    elevator.processNextStep(); // → mở cửa (tick 0)

    expect(elevator.getSnapshot().doorState).toBe('OPEN');

    elevator.processNextStep(); // tick 1
    elevator.processNextStep(); // tick 2
    elevator.processNextStep(); // tick 3 → tự đóng

    expect(elevator.getSnapshot().doorState).toBe('CLOSED');
  });

  it('returns null when moving (no arrival event)', () => {
    const elevator = new Elevator('E1', 1);
    elevator.addDestination(5);

    const result = elevator.processNextStep(); // chỉ di chuyển, chưa đến nơi
    expect(result).toBeNull();
  });
});
