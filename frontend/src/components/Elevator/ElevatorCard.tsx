import type { ElevatorSnapshot } from '../../types/elevator';

interface Props {
  elevator: ElevatorSnapshot;
  onDestination: (id: string, floor: number) => void;
  onDoor: (id: string, action: 'open' | 'hold' | 'close') => void;
}

function State(state: string): string {
  const bảng: Record<string, string> = {
    IDLE: 'Chờ',
    MOVING: 'Đang di chuyển',
    DOOR_OPEN: 'Cửa đang mở',
  };
  return bảng[state] ?? state;
}

function Direction(direction: string): string {
  if (direction === 'UP') return 'Lên';
  if (direction === 'DOWN') return 'Xuống';
  return 'Dừng';
}

function DoorState(doorState: string): string {
  if (doorState === 'OPEN') return 'Mở';
  return 'Đóng';
}

export function ElevatorCard({ elevator, onDestination, onDoor }: Props) {
  return (
    <div className="elevator-card">
      <h3>{elevator.id}</h3>
      <div><span className="label">Tầng hiện tại:</span> <strong>{elevator.currentFloor}</strong></div>
      <div><span className="label">Hướng:</span> {Direction(elevator.direction)}</div>
      <div><span className="label">Trạng thái:</span> {State(elevator.state)}</div>
      <div><span className="label">Cửa:</span> {DoorState(elevator.doorState)}</div>

      <div className="section-label">Chọn tầng đến:</div>
      <div className="destinations">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((floor) => (
          <button
            key={floor}
            onClick={() => onDestination(elevator.id, floor)}
            className={elevator.destinations.includes(floor) ? 'dest-active' : ''}
            title={`Đi đến tầng ${floor}`}
          >
            {floor}
          </button>
        ))}
      </div>

      <div className="door-controls">
        <span className="label">Điều khiển cửa:</span>
        <div>
          <button onClick={() => onDoor(elevator.id, 'open')}>Mở</button>
          <button onClick={() => onDoor(elevator.id, 'hold')}>Giữ</button>
          <button onClick={() => onDoor(elevator.id, 'close')}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
