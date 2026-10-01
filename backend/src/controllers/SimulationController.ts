import { Request, Response } from 'express';
import { SimulationService } from '../application/SimulationService';

export class SimulationController {
  constructor(private readonly service: SimulationService) {}

  start = (_req: Request, res: Response) => {
    this.service.start();
    res.json({ running: this.service.isRunning() });
  };

  stop = (_req: Request, res: Response) => {
    this.service.stop();
    res.json({ running: this.service.isRunning() });
  };

  reset = (_req: Request, res: Response) => {
    this.service.reset();
    res.json({ running: this.service.isRunning() });
  };
}
