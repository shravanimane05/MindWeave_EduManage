import React, { useState, useEffect } from 'react';

interface RiskPredictorProps {
  division: string;
}

const RiskPredictor: React.FC<RiskPredictorProps> = ({ division }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/students?division=${division}`);
        const data = await response.json();
        setStudents(data.students || []);
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, [division]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.prn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student);
    setSearchTerm(student.name);
    setShowDropdown(false);
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 70) return 'text-red-600 bg-red-50';
    if (riskScore >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getRiskLevel = (riskScore: number) => {
    if (riskScore >= 70) return 'High Risk';
    if (riskScore >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <header className="bg-[#1e3a8a] text-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Risk Prediction Dashboard</h2>
        <p className="text-sm opacity-90">Search and analyze individual student risk factors</p>
      </header>

      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
              if (!e.target.value) setSelectedStudent(null);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type student name or PRN..."
          />
        </div>

        {showDropdown && searchTerm && filteredStudents.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredStudents.slice(0, 5).map((student) => (
              <div
                key={student._id}
                onClick={() => handleStudentSelect(student)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.prn}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getRiskColor(student.riskScore || 0)}`}>
                    {student.riskScore || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedStudent && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{selectedStudent.name}</h3>
              <p className="text-gray-600">{selectedStudent.prn} • Division {selectedStudent.division}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getRiskColor(selectedStudent.riskScore || 0)}`}>
              {getRiskLevel(selectedStudent.riskScore || 0)}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 font-bold uppercase">CGPA</p>
              <p className="text-2xl font-bold text-blue-600">{selectedStudent.cgpa}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 font-bold uppercase">Attendance</p>
              <p className="text-2xl font-bold text-green-600">{selectedStudent.attendance}%</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 font-bold uppercase">Backlogs</p>
              <p className="text-2xl font-bold text-orange-600">{selectedStudent.backlogs || 0}</p>
            </div>
            <div className={`p-4 rounded-lg ${getRiskColor(selectedStudent.riskScore || 0)}`}>
              <p className="text-xs font-bold uppercase opacity-70">Risk Score</p>
              <p className="text-2xl font-bold">{selectedStudent.riskScore || 0}</p>
            </div>
          </div>

          {selectedStudent.riskReasons && selectedStudent.riskReasons.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-bold text-red-800 mb-2">Risk Factors:</h4>
              <ul className="space-y-1">
                {selectedStudent.riskReasons.map((reason: string, index: number) => (
                  <li key={index} className="text-sm text-red-700 flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!selectedStudent && (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Search for a Student</h3>
          <p className="text-gray-500">Type a student's name or PRN in the search box above</p>
        </div>
      )}
    </div>
  );
};

export default RiskPredictor;