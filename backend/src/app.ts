import cors from 'cors';
import express from 'express';
import { ElevatorService } from './application/ElevatorService';
import { SimulationService } from './application/SimulationService';
import { ElevatorController } from './controllers/ElevatorController';
import { SimulationController } from './controllers/SimulationController';
import { InMemoryStore } from './infrastructure/InMemoryStore';
import { createElevatorRoutes } from './routes/elevatorRoutes';
import { createSimulationRoutes } from './routes/simulationRoutes';
import { DirectionAwareDispatchStrategy } from './strategies/DispatchStrategy';
import { DispatchService } from './application/DispatchService';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const store = new InMemoryStore();
  const dispatchService = new DispatchService(new DirectionAwareDispatchStrategy());
  const elevatorService = new ElevatorService(store, dispatchService);
  elevatorService.reset();
  const simulationService = new SimulationService(elevatorService);

  const elevatorController = new ElevatorController(elevatorService);
  const simulationController = new SimulationController(simulationService);

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/elevators', createElevatorRoutes(elevatorController));
  app.use('/api/simulation', createSimulationRoutes(simulationController));

  return { app, elevatorService, simulationService };
}
