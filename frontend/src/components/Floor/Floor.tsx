import type { Direction } from '../../types/elevator';

interface Props {
  floor: number;
  onCall: (floor: number, direction: Direction) => void;
}

export function Floor({ floor, onCall }: Props) {
  return (
    <div className="floor">
      <strong>Tầng {floor}</strong>
      <div>
        {floor < 10 && (
          <button onClick={() => onCall(floor, 'UP')}>Lên</button>
        )}
        {floor > 1 && (
          <button onClick={() => onCall(floor, 'DOWN')}>Xuống</button>
        )}
      </div>
    </div>
  );
}
