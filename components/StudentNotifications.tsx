import React from 'react';

const StudentNotifications: React.FC<{ studentPrn: string }> = ({ studentPrn }) => {
  const [alerts, setAlerts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/student-alerts/${studentPrn}`);
        const data = await response.json();
        setAlerts(data.alerts || []);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (studentPrn) {
      fetchAlerts();
    }
  }, [studentPrn]);

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No notifications at this time
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className="border p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">Message from {alert.teacherName}</p>
                  <p className="text-sm text-gray-600">{new Date(alert.timestamp).toLocaleString()}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                  Risk: {alert.riskScore}%
                </span>
              </div>
              <p className="mt-2 text-gray-700">{alert.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotifications;