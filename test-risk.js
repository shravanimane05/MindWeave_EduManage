import { calculateRiskScore } from './backend/riskCalculator.js';

// Test cases
console.log('Testing risk calculator:');
console.log('55% attendance, 5.2 CGPA:', calculateRiskScore(55, 5.2));
console.log('65% attendance, 6.5 CGPA:', calculateRiskScore(65, 6.5));
console.log('88% attendance, 8.2 CGPA:', calculateRiskScore(88, 8.2));