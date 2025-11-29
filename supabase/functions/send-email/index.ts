// Supabase Edge Function: Send Email Notifications
// Handles sending emails via Supabase or external service

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { rateLimitMiddleware } from '../_shared/rateLimiter.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Rate limiting: 20 requests per minute per IP (emails are less critical)
  const rateLimitResponse = rateLimitMiddleware(req, 20, 60000)
  if (rateLimitResponse) {
    return new Response(rateLimitResponse.body, {
      ...rateLimitResponse,
      headers: { ...corsHeaders, ...rateLimitResponse.headers },
    })
  }

  try {
    const { type, userId, eventId, tipId, recipientEmail, subject, htmlContent, ...data } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user preferences
    if (userId) {
      const { data: user } = await supabaseClient
        .from('users')
        .select('email_notifications, tip_notifications, weekly_summary, email')
        .eq('id', userId)
        .single()

      if (user) {
        // Check if user wants this type of notification
        if (type === 'tip_received' && !user.tip_notifications) {
          return new Response(
            JSON.stringify({ message: 'User has disabled tip notifications' }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        if (type === 'weekly_summary' && !user.weekly_summary) {
          return new Response(
            JSON.stringify({ message: 'User has disabled weekly summary' }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        if (!user.email_notifications) {
          return new Response(
            JSON.stringify({ message: 'User has disabled all email notifications' }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Use user's email if not provided
        if (!recipientEmail && user.email) {
          recipientEmail = user.email
        }
      }
    }

    // Send email using Supabase's built-in email or external service
    // For production, integrate with SendGrid, Resend, or similar
    const emailResult = await sendEmailViaService({
      to: recipientEmail,
      subject: subject || getDefaultSubject(type),
      html: htmlContent || getDefaultTemplate(type, { eventId, tipId, ...data }),
    })

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent', emailResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function sendEmailViaService({ to, subject, html }: { to: string; subject: string; html: string }) {
  // Option 1: Use Supabase's built-in email (if configured)
  // Option 2: Use external service like Resend, SendGrid, etc.
  
  // For now, log the email (replace with actual email service)
  console.log('Email would be sent:', { to, subject, html })
  
  // Example with Resend (uncomment and configure):
  /*
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  if (RESEND_API_KEY) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TipNPlay <noreply@tipnplay.io>',
        to: [to],
        subject,
        html,
      }),
    })
    return await response.json()
  }
  */

  return { success: true, message: 'Email logged (configure email service for production)' }
}

function getDefaultSubject(type: string): string {
  const subjects = {
    tip_received: '🎉 You received a tip!',
    event_created: '✅ Your event has been created',
    weekly_summary: '📊 Your weekly TipNPlay summary',
  }
  return subjects[type] || 'Notification from TipNPlay'
}

function getDefaultTemplate(type: string, data: { eventId?: string; tipId?: string }): string {
  const templates = {
    tip_received: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #667eea;">🎉 You received a tip!</h1>
        <p>Great news! Someone just tipped you.</p>
        <p><a href="${Deno.env.get('SITE_URL')}/dj-dashboard">View your dashboard</a></p>
      </div>
    `,
    event_created: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #667eea;">✅ Your event has been created!</h1>
        <p>Your event is ready to accept tips.</p>
        <p><a href="${Deno.env.get('SITE_URL')}/dj-dashboard">Manage your event</a></p>
      </div>
    `,
    weekly_summary: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #667eea;">📊 Your weekly TipNPlay summary</h1>
        <p>Here's your weekly performance summary.</p>
        <p><a href="${Deno.env.get('SITE_URL')}/dj-dashboard">View full analytics</a></p>
      </div>
    `,
  }
  return templates[type] || '<p>Notification from TipNPlay</p>'
}

