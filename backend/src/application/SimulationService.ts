import { ElevatorService } from './ElevatorService';

export class SimulationService {
  private timer?: NodeJS.Timeout;
  private running = false;

  constructor(private readonly elevatorService: ElevatorService) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.timer = setInterval(() => this.elevatorService.tick(), 1000);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
    this.running = false;
  }

  reset(): void {
    this.stop();
    this.elevatorService.reset();
  }

  isRunning(): boolean {
    return this.running;
  }
}
