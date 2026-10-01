import { describe, expect, it } from 'vitest';
import { DispatchService } from '../src/application/DispatchService';
import { Elevator } from '../src/domain/Elevator';
import { Direction } from '../src/domain/enums';
import { PassengerRequest } from '../src/domain/PassengerRequest';
import { DirectionAwareDispatchStrategy } from '../src/strategies/DispatchStrategy';

describe('DispatchService', () => {
  it('selects the closest suitable elevator', () => {
    const service = new DispatchService(new DirectionAwareDispatchStrategy());
    const elevators = [new Elevator('E1', 1), new Elevator('E2', 8), new Elevator('E3', 10)];
    const request = new PassengerRequest('R1', 2, Direction.UP);

    expect(service.findBestElevator(request, elevators)?.id).toBe('E1');
  });

  it('ignores an elevator going in the wrong direction', () => {
    const service = new DispatchService(new DirectionAwareDispatchStrategy());
    const elevator = new Elevator('E1', 8);
    elevator.addDestination(1);
    const request = new PassengerRequest('R1', 5, Direction.UP);

    expect(service.findBestElevator(request, [elevator])).toBeNull();
  });
});
