import type { Direction, ElevatorSnapshot } from '../../types/elevator';
import { Floor } from '../Floor/Floor';
import { ElevatorCard } from '../Elevator/ElevatorCard';

interface Props {
  elevators: ElevatorSnapshot[];
  onCall: (floor: number, direction: Direction) => void;
  onDestination: (id: string, floor: number) => void;
  onDoor: (id: string, action: 'open' | 'hold' | 'close') => void;
}

export function Building({ elevators, onCall, onDestination, onDoor }: Props) {
  return (
    <div className="layout">
      <div className="building">
        {Array.from({ length: 10 }, (_, index) => 10 - index).map((floor) => (
          <Floor key={floor} floor={floor} onCall={onCall} />
        ))}
      </div>
      <aside className="elevator-list">
        {elevators.map((elevator) => (
          <ElevatorCard
            key={elevator.id}
            elevator={elevator}
            onDestination={onDestination}
            onDoor={onDoor}
          />
        ))}
      </aside>
    </div>
  );
}
