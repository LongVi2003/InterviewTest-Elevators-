import { Request, Response } from 'express';
import { z } from 'zod';
import { Direction } from '../domain/enums';
import { ElevatorService } from '../application/ElevatorService';

// Schema validation với Zod
const RequestSchema = z.object({
  floor: z.number({ invalid_type_error: 'floor phải là số' }).int().min(1).max(10),
  direction: z.enum(['UP', 'DOWN'], { message: 'direction phải là UP hoặc DOWN' }),
});

const DestinationSchema = z.object({
  floor: z.number({ invalid_type_error: 'floor phải là số' }).int().min(1).max(10),
});

export class ElevatorController {
  constructor(private readonly service: ElevatorService) {}

  getState = (_req: Request, res: Response) => {
    res.json(this.service.getState());
  };

  request = (req: Request, res: Response) => {
    const parsed = RequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.errors[0].message });
      return;
    }

    try {
      const request = this.service.requestElevator(
        parsed.data.floor,
        parsed.data.direction as Direction,
      );
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  };

  destination = (req: Request, res: Response) => {
    const parsed = DestinationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.errors[0].message });
      return;
    }

    try {
      const id = String(req.params.id);
      const elevator = this.service.addDestination(id, parsed.data.floor);
      res.json(elevator.getSnapshot());
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  };

  openDoor = (req: Request, res: Response) => this.doorAction(req, res, 'open');
  holdDoor = (req: Request, res: Response) => this.doorAction(req, res, 'hold');
  closeDoor = (req: Request, res: Response) => this.doorAction(req, res, 'close');

  private doorAction(req: Request, res: Response, action: 'open' | 'hold' | 'close') {
    try {
      const id = String(req.params.id);
      const elevator =
        action === 'open'
          ? this.service.openDoor(id)
          : action === 'hold'
            ? this.service.holdDoor(id)
            : this.service.closeDoor(id);
      res.json(elevator.getSnapshot());
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
