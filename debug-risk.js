import { calculateRiskScore } from './backend/riskCalculator.js';

console.log('Testing problematic cases:');
console.log('Aarav (76%, 6.4):', calculateRiskScore(76, 6.4));
console.log('Rohan (80%, 6.8):', calculateRiskScore(80, 6.8));
console.log('Aditya (52%, 6.2):', calculateRiskScore(52, 6.2));
console.log('Leena (82%, 6.9):', calculateRiskScore(82, 6.9));

console.log('\nTesting working cases:');
console.log('Isha (55%, 5.2):', calculateRiskScore(55, 5.2));
console.log('Kunal (58%, 4.8):', calculateRiskScore(58, 4.8));