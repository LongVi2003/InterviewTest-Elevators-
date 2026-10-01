import { Router } from 'express';
import { ElevatorController } from '../controllers/ElevatorController';

export function createElevatorRoutes(controller: ElevatorController): Router {
  const router = Router();
  router.get('/', controller.getState);
  router.post('/requests', controller.request);
  router.post('/:id/destinations', controller.destination);
  router.post('/:id/door/open', controller.openDoor);
  router.post('/:id/door/hold', controller.holdDoor);
  router.post('/:id/door/close', controller.closeDoor);
  return router;
}
