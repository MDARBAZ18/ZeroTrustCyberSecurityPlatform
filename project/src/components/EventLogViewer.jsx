import { useEffect, useState } from 'react';
import { contract } from '../services/web3';

export default function EventLogViewer() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const result = await contract.methods.viewLogs().call();
        setLogs(result);
      } catch (err) {
        console.error("Failed to fetch logs from blockchain:", err);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); // Refresh every 10s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">📜 On-Chain Logs</h2>
      {logs.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        <ul className="space-y-2">
          {logs.map((log, i) => (
            <li key={i} className="bg-gray-100 p-2 rounded">
              <code>{JSON.stringify(log)}</code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
