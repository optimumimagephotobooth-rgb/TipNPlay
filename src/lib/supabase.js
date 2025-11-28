import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://your-project.supabase.co' && 
         supabaseAnonKey !== 'your-anon-key' &&
         supabaseUrl.startsWith('https://') &&
         supabaseAnonKey.length > 20
}

// Create Supabase client with optimized settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'x-client-info': 'tipnplay-web'
    }
  }
})

// Database schema helpers
export const eventsTable = 'events'
export const tipsTable = 'tips'
export const usersTable = 'users'

// Connection test helper
export async function testConnection() {
  if (!isSupabaseConfigured()) {
    console.warn('⚠️  Supabase not configured. Using fallback mode.')
    return { connected: false, reason: 'Not configured' }
  }

  try {
    const { data, error } = await supabase
      .from(eventsTable)
      .select('id')
      .limit(1)

    if (error) {
      console.error('❌ Supabase connection error:', error.message)
      return { connected: false, error: error.message }
    }

    console.log('✅ Supabase connected successfully!')
    return { connected: true }
  } catch (err) {
    console.error('❌ Supabase connection failed:', err)
    return { connected: false, error: err.message }
  }
}

