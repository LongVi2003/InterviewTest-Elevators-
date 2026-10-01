import type { Direction, ElevatorSnapshot, ElevatorSystemState, PassengerRequest } from '../types/elevator';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message ?? 'Request failed');
  }

  return response.json();
}

export const elevatorApi = {
  getState: () => request<ElevatorSystemState>('/elevators'),
  call: (floor: number, direction: Direction) =>
    request<PassengerRequest>('/elevators/requests', {
      method: 'POST',
      body: JSON.stringify({ floor, direction }),
    }),
  destination: (id: string, floor: number) =>
    request<ElevatorSnapshot>(`/elevators/${id}/destinations`, {
      method: 'POST',
      body: JSON.stringify({ floor }),
    }),
  door: (id: string, action: 'open' | 'hold' | 'close') =>
    request<ElevatorSnapshot>(`/elevators/${id}/door/${action}`, { method: 'POST' }),
  start: () => request('/simulation/start', { method: 'POST' }),
  stop: () => request('/simulation/stop', { method: 'POST' }),
  reset: () => request('/simulation/reset', { method: 'POST' }),
};
