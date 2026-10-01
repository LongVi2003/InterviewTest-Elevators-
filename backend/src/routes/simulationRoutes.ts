import { Router } from 'express';
import { SimulationController } from '../controllers/SimulationController';

export function createSimulationRoutes(controller: SimulationController): Router {
  const router = Router();
  router.post('/start', controller.start);
  router.post('/stop', controller.stop);
  router.post('/reset', controller.reset);
  return router;
}
