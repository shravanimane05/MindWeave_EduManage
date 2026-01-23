import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface StudentRiskPredictorProps {
  user: User;
}

const StudentRiskPredictor: React.FC<StudentRiskPredictorProps> = ({ user }) => {
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Hypothetical values
  const [hypotheticalAttendance, setHypotheticalAttendance] = useState('');
  const [hypotheticalMarks, setHypotheticalMarks] = useState('');
  const [hypotheticalBacklogs, setHypotheticalBacklogs] = useState('');
  const [hypotheticalDisciplinary, setHypotheticalDisciplinary] = useState(false);
  
  // Results
  const [currentRisk, setCurrentRisk] = useState<any>(null);
  const [predictedRisk, setPredictedRisk] = useState<any>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/students?division=${user.division}`);
        const data = await response.json();
        const student = data.students?.find((s: any) => s.prn === user.prn);
        
        if (student) {
          setStudentData(student);
          
          // Set current values as defaults
          setHypotheticalAttendance(student.attendance?.toString() || '');
          setHypotheticalMarks(student.endsemMarks?.toString() || '0');
          setHypotheticalBacklogs(student.backlogs?.toString() || '0');
          setHypotheticalDisciplinary(student.disciplinaryIssues || false);
          
          // Calculate current risk
          const current = calculateRiskScore(
            student.attendance || 0,
            student.cgpa || 0,
            student.backlogs || 0,
            student.disciplinaryIssues || false
          );
          setCurrentRisk(current);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, [user.prn, user.division]);

  const calculateRiskScore = (attendance: number, cgpa: number, backlogs: number, disciplinary: boolean, marks: number = 0) => {
    let totalRiskScore = 0;
    const reasons = [];

    // Attendance rules
    if (attendance < 60) {
      totalRiskScore += 30;
      reasons.push('Very low attendance (<60%)');
    } else if (attendance < 75) {
      totalRiskScore += 20;
      reasons.push('Low attendance (<75%)');
    }

    // CGPA rules
    if (cgpa < 5.0) {
      totalRiskScore += 35;
      reasons.push('Very low CGPA (<5.0)');
    } else if (cgpa < 6.5) {
      totalRiskScore += 25;
      reasons.push('Low CGPA (<6.5)');
    }

    // Marks rules (if provided)
    if (marks > 0) {
      if (marks < 20) {
        totalRiskScore += 25;
        reasons.push('Very low marks (<20/50)');
      } else if (marks < 30) {
        totalRiskScore += 15;
        reasons.push('Low marks (<30/50)');
      }
    }

    // Backlogs rules
    if (backlogs >= 4) {
      totalRiskScore += 30;
      reasons.push('High number of backlogs (>=4)');
    } else if (backlogs >= 2) {
      totalRiskScore += 20;
      reasons.push('Multiple backlogs (>=2)');
    }

    // Disciplinary issues
    if (disciplinary) {
      totalRiskScore += 10;
      reasons.push('Disciplinary issues reported');
    }

    // Cap at 100
    totalRiskScore = Math.min(100, totalRiskScore);

    // Determine risk level
    let riskLevel;
    if (totalRiskScore >= 70) {
      riskLevel = 'High';
    } else if (totalRiskScore >= 40) {
      riskLevel = 'Medium';
    } else {
      riskLevel = 'Low';
    }

    return { totalRiskScore, riskLevel, reasons };
  };

  const handlePredict = () => {
    if (!studentData) return;
    
    const attendance = parseFloat(hypotheticalAttendance) || 0;
    const marks = parseFloat(hypotheticalMarks) || 0;
    const cgpa = studentData.cgpa || 0;
    const backlogs = parseInt(hypotheticalBacklogs) || 0;
    
    const predicted = calculateRiskScore(attendance, cgpa, backlogs, hypotheticalDisciplinary, marks);
    setPredictedRisk(predicted);
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 70) return 'text-red-600 bg-red-50 border-red-200';
    if (riskScore >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getRiskChangeColor = (current: number, predicted: number) => {
    if (predicted > current) return 'text-red-600';
    if (predicted < current) return 'text-green-600';
    return 'text-gray-600';
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!studentData) {
    return <div className="p-8">Student data not found</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <header className="bg-[#b8860b] text-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Risk Predictor - {studentData.name}</h2>
        <p className="text-sm opacity-90">Predict your risk with "what-if" scenarios</p>
      </header>

      {/* Student Info */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Your Current Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 font-bold uppercase">PRN</p>
            <p className="text-lg font-bold text-gray-800">{studentData.prn}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 font-bold uppercase">CGPA</p>
            <p className="text-lg font-bold text-gray-800">{studentData.cgpa}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 font-bold uppercase">Attendance</p>
            <p className="text-lg font-bold text-gray-800">{studentData.attendance}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 font-bold uppercase">Backlogs</p>
            <p className="text-lg font-bold text-gray-800">{studentData.backlogs}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">What-If Scenario</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hypothetical Attendance (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={hypotheticalAttendance}
                onChange={(e) => setHypotheticalAttendance(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter attendance percentage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hypothetical End Semester Marks (out of 50)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={hypotheticalMarks}
                onChange={(e) => setHypotheticalMarks(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter marks out of 50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hypothetical Backlogs
              </label>
              <input
                type="number"
                min="0"
                value={hypotheticalBacklogs}
                onChange={(e) => setHypotheticalBacklogs(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter number of backlogs"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={hypotheticalDisciplinary}
                  onChange={(e) => setHypotheticalDisciplinary(e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Disciplinary Issues</span>
              </label>
            </div>

            <button
              onClick={handlePredict}
              className="w-full bg-[#b8860b] text-white py-3 rounded-lg hover:bg-[#996608] transition font-medium"
            >
              Predict My Risk Score
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Current Risk */}
          {currentRisk && (
            <div className={`rounded-xl border p-6 ${getRiskColor(currentRisk.totalRiskScore)}`}>
              <h4 className="font-bold mb-2">Current Risk Score</h4>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold">{currentRisk.totalRiskScore}</span>
                <span className="px-3 py-1 rounded-full text-sm font-bold">
                  {currentRisk.riskLevel} Risk
                </span>
              </div>
              {currentRisk.reasons.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Current Risk Factors:</p>
                  <ul className="space-y-1">
                    {currentRisk.reasons.map((reason: string, index: number) => (
                      <li key={index} className="text-xs flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full mr-2 opacity-60 bg-current"></span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Predicted Risk */}
          {predictedRisk && (
            <div className={`rounded-xl border p-6 ${getRiskColor(predictedRisk.totalRiskScore)}`}>
              <h4 className="font-bold mb-2">Predicted Risk Score</h4>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold">{predictedRisk.totalRiskScore}</span>
                <span className="px-3 py-1 rounded-full text-sm font-bold">
                  {predictedRisk.riskLevel} Risk
                </span>
              </div>
              
              {/* Risk Change */}
              {currentRisk && (
                <div className={`text-sm font-medium mb-4 ${getRiskChangeColor(currentRisk.totalRiskScore, predictedRisk.totalRiskScore)}`}>
                  Change: {predictedRisk.totalRiskScore > currentRisk.totalRiskScore ? '+' : ''}
                  {predictedRisk.totalRiskScore - currentRisk.totalRiskScore} points
                  {predictedRisk.totalRiskScore > currentRisk.totalRiskScore && ' ⚠️ Risk Increased'}
                  {predictedRisk.totalRiskScore < currentRisk.totalRiskScore && ' ✅ Risk Decreased'}
                  {predictedRisk.totalRiskScore === currentRisk.totalRiskScore && ' ➡️ No Change'}
                </div>
              )}

              {predictedRisk.reasons.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Predicted Risk Factors:</p>
                  <ul className="space-y-1">
                    {predictedRisk.reasons.map((reason: string, index: number) => (
                      <li key={index} className="text-xs flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full mr-2 opacity-60 bg-current"></span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentRiskPredictor;