import { useCallback, useEffect, useState } from 'react';
import { elevatorApi } from '../services/elevatorApi';
import type { Direction, ElevatorSystemState } from '../types/elevator';

const initialState: ElevatorSystemState = { elevators: [], requests: [] };

export function useElevatorSystem() {
  const [state, setState] = useState<ElevatorSystemState>(initialState);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setState(await elevatorApi.getState());
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 500);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const callElevator = async (floor: number, direction: Direction) => {
    try {
      await elevatorApi.call(floor, direction);
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return { state, error, refresh, callElevator };
}
