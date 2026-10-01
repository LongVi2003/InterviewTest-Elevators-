import { Elevator } from '../domain/Elevator';
import { PassengerRequest } from '../domain/PassengerRequest';

export interface DispatchStrategy {
  score(elevator: Elevator, request: PassengerRequest): number;
}

export class DirectionAwareDispatchStrategy implements DispatchStrategy {
  score(elevator: Elevator, request: PassengerRequest): number {
    if (!elevator.canServe(request)) return Number.POSITIVE_INFINITY;

    const distance = Math.abs(elevator.getCurrentFloor() - request.floor);
    const stops = elevator.getDestinations().length;

    return distance + stops * 2;
  }
}
