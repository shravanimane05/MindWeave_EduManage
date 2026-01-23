import { supabase } from './alertsClient'

export const sendSMSAlert = async (phoneNumber: string, studentName: string, riskScore: number) => {
  try {
    // Insert SMS alert into Supabase table
    const { data, error } = await supabase
      .from('sms_alerts')
      .insert([
        {
          phone_number: phoneNumber,
          student_name: studentName,
          risk_score: riskScore,
          message: `Alert: ${studentName} has a high dropout risk score of ${riskScore}%. Please contact immediately.`,
          sent_at: new Date().toISOString(),
          status: 'sent'
        }
      ])

    if (error) {
      console.error('SMS Alert Error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('SMS Service Error:', error)
    return { success: false, error: 'Failed to send SMS alert' }
  }
}