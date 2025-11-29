import { createClient } from '@supabase/supabase-js'

const PLACEHOLDER_URL = 'https://your-project.supabase.co'
const PLACEHOLDER_ANON_KEY = 'your-anon-key'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || PLACEHOLDER_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || PLACEHOLDER_ANON_KEY

const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  supabaseUrl !== PLACEHOLDER_URL &&
  supabaseAnonKey !== PLACEHOLDER_ANON_KEY

const createChainableStub = () => {
  const stub = {}
  const chainableMethods = [
    'select',
    'insert',
    'update',
    'delete',
    'eq',
    'neq',
    'gt',
    'lt',
    'gte',
    'lte',
    'like',
    'ilike',
    'or',
    'filter',
    'order',
    'limit',
    'range',
    'single',
    'maybeSingle',
  ]

  chainableMethods.forEach((method) => {
    stub[method] = () => stub
  })

  stub.then = (resolve) => {
    resolve({ data: null, error: { message: 'Supabase not configured' } })
    return stub
  }
  stub.catch = () => stub

  return stub
}

const createDemoClient = () => ({
  from: () => createChainableStub(),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signIn: async () => ({
      data: null,
      error: { message: 'Supabase is not configured for this environment' },
    }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({
      data: {
        subscription: { unsubscribe: () => {} },
      },
    }),
  },
  functions: {
    invoke: async () => ({
      data: null,
      error: { message: 'Supabase is not configured for this environment' },
    }),
  },
})

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createDemoClient()
export const eventsTable = 'events'
export const tipsTable = 'tips'
export const usersTable = 'users'
export const getSupabaseUrl = () => supabaseUrl
export { isSupabaseConfigured }

