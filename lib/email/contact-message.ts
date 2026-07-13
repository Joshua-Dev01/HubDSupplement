type ContactMessage = {
  name: string
  email: string
  subject: string
  message: string
}

export function contactNotificationHTML(msg: ContactMessage) {
  return `
  <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1F2421;">
    <div style="background: #5F7A5B; padding: 20px; text-align: center;">
      <h1 style="color: #fff; font-size: 16px; letter-spacing: 1px; margin: 0;">📩 New Contact Message</h1>
    </div>
    <div style="padding: 24px;">
      <p style="font-size: 14px;"><strong>From:</strong> ${msg.name} (${msg.email})</p>
      <p style="font-size: 14px;"><strong>Subject:</strong> ${msg.subject}</p>
      <div style="margin-top: 16px; padding: 16px; background: #F7F5F0; border-radius: 8px;">
        <p style="font-size: 14px; white-space: pre-wrap; margin: 0;">${msg.message}</p>
      </div>
      <a href="mailto:${msg.email}" style="display: inline-block; margin-top: 20px; background: #1F2421; color: #fff; padding: 10px 20px; text-decoration: none; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px;">
        Reply to ${msg.name}
      </a>
    </div>
  </div>
  `
}