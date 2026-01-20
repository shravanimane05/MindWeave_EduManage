
export const sendSMS = async (to: string, message: string) => {
  console.log(`[TWILIO API] Initializing request to SID: ${.env.TWILIO_SID}`);

  console.log(`[TWILIO API] Sending SMS to ${to}: ${message}`);
  
  // Real-world simulation: trigger a UI alert so user knows it worked
  const event = new CustomEvent('twilio-sent', { 
    detail: { to, message } 
  });
  window.dispatchEvent(event);

  await new Promise(resolve => setTimeout(resolve, 800));
  return { success: true, sid: 'SM' + Math.random().toString(36).substr(2, 12) };
};

export const sendAlertToStudent = async (student: { name: string, phone: string, email: string }, type: 'Attendance' | 'Risk' | 'General') => {
  let message = '';
  switch(type) {
    case 'Attendance':
      message = `EduManage Alert: Dear ${student.name}, your attendance is critical. Please visit the portal immediately.`;
      break;
    case 'Risk':
      message = `EduManage URGENT: Dear ${student.name}, you have been flagged as high risk. A meeting with Dr. Williams is scheduled for tomorrow.`;
      break;
    default:
      message = `EduManage: Hello ${student.name}, a new update regarding your recent unit test results is available.`;
  }
  
  return await sendSMS(student.phone, message);
};
