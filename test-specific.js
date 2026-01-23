import { calculateRiskScore } from './backend/riskCalculator.js';

console.log('Testing specific examples:');
console.log('Isha (55%, 5.2):', calculateRiskScore(55, 5.2));
console.log('Kunal (58%, 4.8):', calculateRiskScore(58, 4.8));
console.log('Maya (78%, 4.2):', calculateRiskScore(78, 4.2));
console.log('Riya (45%, 5.1):', calculateRiskScore(45, 5.1));