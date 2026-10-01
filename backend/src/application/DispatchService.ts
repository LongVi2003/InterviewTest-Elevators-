import { Elevator } from '../domain/Elevator';
import { PassengerRequest } from '../domain/PassengerRequest';
import { DispatchStrategy } from '../strategies/DispatchStrategy';

export class DispatchService {
  constructor(private readonly strategy: DispatchStrategy) {}

  findBestElevator(request: PassengerRequest, elevators: Elevator[]): Elevator | null {
    let best: Elevator | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (const elevator of elevators) {
      const score = this.strategy.score(elevator, request);
      if (score < bestScore) {
        best = elevator;
        bestScore = score;
      }
    }

    return best;
  }
}
