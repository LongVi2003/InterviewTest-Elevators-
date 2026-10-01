import { Elevator } from '../domain/Elevator';
import { PassengerRequest } from '../domain/PassengerRequest';

export class InMemoryStore {
  readonly elevators = new Map<string, Elevator>();
  readonly requests = new Map<string, PassengerRequest>();

  clear(): void {
    this.elevators.clear();
    this.requests.clear();
  }
}
