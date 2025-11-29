// Email Templates for TipNPlay
// Professional HTML email templates

const SITE_URL = Deno.env.get('SITE_URL') || 'https://tipnplay.io'
const BRAND_COLOR = '#667eea'
const BRAND_COLOR_SECONDARY = '#764ba2'

/**
 * Base email template wrapper
 */
function baseTemplate(content: string, title: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, ${BRAND_COLOR} 0%, ${BRAND_COLOR_SECONDARY} 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">TipNPlay</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9f9f9; border-radius: 0 0 12px 12px; text-align: center; font-size: 14px; color: #666666;">
              <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} TipNPlay. All rights reserved.</p>
              <p style="margin: 0;">
                <a href="${SITE_URL}" style="color: ${BRAND_COLOR}; text-decoration: none;">Visit TipNPlay</a> |
                <a href="${SITE_URL}/profile" style="color: ${BRAND_COLOR}; text-decoration: none;">Manage Account</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/**
 * Tip received email template
 */
export function tipReceivedTemplate(data: {
  amount: number
  tipperName: string
  message?: string
  eventName: string
  eventId: string
}): string {
  const content = `
    <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px;">🎉 You Received a Tip!</h2>
    
    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Great news! <strong>${escapeHtml(data.tipperName)}</strong> just tipped you <strong>$${data.amount.toFixed(2)}</strong> for your event <strong>"${escapeHtml(data.eventName)}"</strong>.
    </p>
    
    ${data.message ? `
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #333333; font-style: italic;">"${escapeHtml(data.message)}"</p>
    </div>
    ` : ''}
    
    <div style="margin: 30px 0; text-align: center;">
      <a href="${SITE_URL}/dj-dashboard" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, ${BRAND_COLOR} 0%, ${BRAND_COLOR_SECONDARY} 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        View Dashboard
      </a>
    </div>
    
    <p style="color: #999999; font-size: 14px; margin: 30px 0 0; text-align: center;">
      Keep the music playing! 🎵
    </p>
  `
  
  return baseTemplate(content, 'You Received a Tip!')
}

/**
 * Event created email template
 */
export function eventCreatedTemplate(data: {
  eventName: string
  eventId: string
  tipUrl: string
}): string {
  const content = `
    <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px;">✅ Your Event Has Been Created!</h2>
    
    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Your event <strong>"${escapeHtml(data.eventName)}"</strong> is now live and ready to accept tips!
    </p>
    
    <div style="background-color: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${BRAND_COLOR};">
      <p style="margin: 0 0 10px; color: #333333; font-weight: 600;">Your Tip Link:</p>
      <p style="margin: 0; word-break: break-all;">
        <a href="${data.tipUrl}" style="color: ${BRAND_COLOR}; text-decoration: none;">${data.tipUrl}</a>
      </p>
    </div>
    
    <div style="margin: 30px 0; text-align: center;">
      <a href="${SITE_URL}/dj-dashboard" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, ${BRAND_COLOR} 0%, ${BRAND_COLOR_SECONDARY} 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Manage Event
      </a>
    </div>
    
    <p style="color: #999999; font-size: 14px; margin: 30px 0 0; text-align: center;">
      Share your tip link with your audience to start receiving tips!
    </p>
  `
  
  return baseTemplate(content, 'Event Created Successfully')
}

/**
 * Weekly summary email template
 */
export function weeklySummaryTemplate(data: {
  totalTips: number
  tipCount: number
  topEvent: { name: string; amount: number }
  period: string
}): string {
  const content = `
    <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px;">📊 Your Weekly TipNPlay Summary</h2>
    
    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
      Here's your performance summary for ${data.period}:
    </p>
    
    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr>
        <td style="padding: 20px; background-color: #f9f9f9; border-radius: 8px; text-align: center;">
          <div style="font-size: 32px; font-weight: 700; color: ${BRAND_COLOR}; margin-bottom: 5px;">$${data.totalTips.toFixed(2)}</div>
          <div style="color: #666666; font-size: 14px;">Total Tips</div>
        </td>
        <td style="padding: 20px; background-color: #f9f9f9; border-radius: 8px; text-align: center;">
          <div style="font-size: 32px; font-weight: 700; color: ${BRAND_COLOR}; margin-bottom: 5px;">${data.tipCount}</div>
          <div style="color: #666666; font-size: 14px;">Total Tip Count</div>
        </td>
      </tr>
    </table>
    
    ${data.topEvent ? `
    <div style="background-color: #fff4e6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffd700;">
      <p style="margin: 0 0 10px; color: #333333; font-weight: 600;">🏆 Top Performing Event:</p>
      <p style="margin: 0; color: #666666;">
        <strong>"${escapeHtml(data.topEvent.name)}"</strong> - $${data.topEvent.amount.toFixed(2)}
      </p>
    </div>
    ` : ''}
    
    <div style="margin: 30px 0; text-align: center;">
      <a href="${SITE_URL}/dj-dashboard" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, ${BRAND_COLOR} 0%, ${BRAND_COLOR_SECONDARY} 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        View Full Analytics
      </a>
    </div>
    
    <p style="color: #999999; font-size: 14px; margin: 30px 0 0; text-align: center;">
      Keep creating amazing events! 🎉
    </p>
  `
  
  return baseTemplate(content, 'Your Weekly Summary')
}

/**
 * Welcome email template
 */
export function welcomeTemplate(data: { userName: string }): string {
  const content = `
    <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px;">Welcome to TipNPlay! 🎉</h2>
    
    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Hi ${escapeHtml(data.userName)},
    </p>
    
    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Welcome to TipNPlay! We're excited to have you on board. You're now ready to start accepting live tips from your audience.
    </p>
    
    <div style="margin: 30px 0; text-align: center;">
      <a href="${SITE_URL}/create-event" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, ${BRAND_COLOR} 0%, ${BRAND_COLOR_SECONDARY} 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Create Your First Event
      </a>
    </div>
    
    <p style="color: #999999; font-size: 14px; margin: 30px 0 0; text-align: center;">
      Need help? Check out our <a href="${SITE_URL}" style="color: ${BRAND_COLOR};">documentation</a> or contact support.
    </p>
  `
  
  return baseTemplate(content, 'Welcome to TipNPlay')
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

