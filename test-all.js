import { calculateRiskScore } from './backend/riskCalculator.js';

console.log('Testing all students:');
console.log('Isha (55%, 5.2):', calculateRiskScore(55, 5.2));
console.log('Kunal (58%, 4.8):', calculateRiskScore(58, 4.8));
console.log('Maya (78%, 4.2):', calculateRiskScore(78, 4.2));
console.log('Riya (45%, 5.1):', calculateRiskScore(45, 5.1));
console.log('Aditya (52%, 6.2):', calculateRiskScore(52, 6.2));
console.log('Sofia (62%, 4.5):', calculateRiskScore(62, 4.5));
console.log('Kabir (50%, 7.2):', calculateRiskScore(50, 7.2));
console.log('Aarav (76%, 6.4):', calculateRiskScore(76, 6.4));
console.log('Rohan (80%, 6.8):', calculateRiskScore(80, 6.8));
console.log('Leena (82%, 6.9):', calculateRiskScore(82, 6.9));