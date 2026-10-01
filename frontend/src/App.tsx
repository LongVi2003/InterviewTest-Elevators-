import { useElevatorSystem } from './hooks/useElevatorSystem';
import { elevatorApi } from './services/elevatorApi';
import { Building } from './components/Building/Building';
import './styles.css';

function Status(status: string): string {
  const bảngDịch: Record<string, string> = {
    PENDING: 'Đang chờ',
    ASSIGNED: 'Đã phân công',
    PICKED_UP: 'Đã đón',
    COMPLETED: 'Hoàn thành',
  };
  return bảngDịch[status] ?? status;
}

function Direction(direction: string): string {
  if (direction === 'UP') return 'Lên';
  if (direction === 'DOWN') return 'Xuống';
  return direction;
}

export default function App() {
  const { state, error, callElevator, refresh } = useElevatorSystem();

  const action = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      await refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main>
      <header>
        <div>
          <h1>Mô Phỏng Thang Máy</h1>
          <p>3 thang máy · 10 tầng · điều phối theo hướng di chuyển</p>
        </div>
        <div className="toolbar">
          <button onClick={() => action(elevatorApi.start)}>Bắt đầu</button>
          <button onClick={() => action(elevatorApi.stop)}>Dừng</button>
          <button onClick={() => action(elevatorApi.reset)}>Đặt lại</button>
        </div>
      </header>

      {error && <div className="error">⚠️ Lỗi: {error}</div>}

      <Building
        elevators={state.elevators}
        onCall={callElevator}
        onDestination={(id, floor) => action(() => elevatorApi.destination(id, floor))}
        onDoor={(id, actionName) => action(() => elevatorApi.door(id, actionName))}
      />

      <section className="requests">
        <h2>Danh sách yêu cầu</h2>
        {state.requests.length === 0 ? (
          <p className="no-requests">Chưa có yêu cầu nào.</p>
        ) : (
          <table className="request-table">
            <thead>
              <tr>
                <th>Tầng</th>
                <th>Hướng</th>
                <th>Trạng thái</th>
                <th>Thang máy phụ trách</th>
              </tr>
            </thead>
            <tbody>
              {state.requests.map((request) => (
                <tr key={request.id} className={`status-${request.status.toLowerCase()}`}>
                  <td>Tầng {request.floor}</td>
                  <td>{Direction(request.direction)}</td>
                  <td>{Status(request.status)}</td>
                  <td>{request.assignedElevatorId ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
