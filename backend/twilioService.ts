
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_SECRET = process.env.TWILIO_SECRET;
const FROM_WHATSAPP = `whatsapp:+91${process.env.TWILIO_PHONE}`;

export const sendSMS = async (to: string, message: string) => {
  const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:+91${to}`;
  
  console.log(`[TWILIO] Using SID: ${TWILIO_SID}`);
  
  const event = new CustomEvent('twilio-sent', { 
    detail: { to: formattedTo, message } 
  });
  window.dispatchEvent(event);

  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, sid: 'MSG' + Math.random().toString(36).substr(2, 8) };
};

export const sendAlertToStudent = async (student: any, type: string) => {
  const msg = `*EduManage Alert* 🎓\n\nDear ${student.name},\nYour attendance is currently ${student.attendance}%. This is below the required 75%.\n\nPlease meet your Class Teacher immediately.`;
  return await sendSMS(student.phone, msg);
};
