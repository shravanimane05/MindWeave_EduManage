export function calculateRiskScore(attendance, cgpa) {
  let totalRiskScore = 0;
  const reasons = [];

  // Attendance Risk
  if (attendance < 60) {
    totalRiskScore += 30;
    reasons.push('Very low attendance (<60%)');
  } else if (attendance < 75) {
    totalRiskScore += 20;
    reasons.push('Low attendance (<75%)');
  }

  // CGPA Risk  
  if (cgpa < 5.0) {
    totalRiskScore += 35;
    reasons.push('Very low CGPA (<5.0)');
  } else if (cgpa < 6.0) {
    totalRiskScore += 25;
    reasons.push('Low CGPA (<6.0)');
  } else if (cgpa < 7.0) {
    totalRiskScore += 20;
    reasons.push('Below average CGPA (<7.0)');
  }

  const riskLevel = totalRiskScore >= 50 ? 'High' : 'Low';

  return {
    totalRiskScore,
    riskLevel,
    reasons
  };
}
