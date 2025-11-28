/**
 * Supabase Connection Test Utility
 * Run this in browser console to test your Supabase connection
 */

import { supabase, eventsTable, tipsTable } from '../lib/supabase'

export async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...')
  console.log('================================')
  
  const results = {
    connection: false,
    tables: {},
    errors: []
  }

  try {
    // Test 1: Check if Supabase client is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    console.log('\n1. Checking Environment Variables:')
    console.log('   VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
    console.log('   VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing')
    
    if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
      results.errors.push('VITE_SUPABASE_URL is not configured')
      console.log('   ⚠️  Using placeholder URL')
    }
    
    if (!supabaseKey || supabaseKey === 'your-anon-key') {
      results.errors.push('VITE_SUPABASE_ANON_KEY is not configured')
      console.log('   ⚠️  Using placeholder key')
    }

    // Test 2: Test connection
    console.log('\n2. Testing Connection:')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.log('   ⚠️  Auth check:', authError.message)
    } else {
      console.log('   ✅ Connection successful')
      results.connection = true
    }

    // Test 3: Check if tables exist
    console.log('\n3. Checking Tables:')
    
    // Test events table
    const { data: eventsData, error: eventsError } = await supabase
      .from(eventsTable)
      .select('id')
      .limit(1)
    
    if (eventsError) {
      console.log('   ❌ Events table:', eventsError.message)
      results.tables.events = false
      results.errors.push(`Events table error: ${eventsError.message}`)
    } else {
      console.log('   ✅ Events table exists')
      results.tables.events = true
    }

    // Test tips table
    const { data: tipsData, error: tipsError } = await supabase
      .from(tipsTable)
      .select('id')
      .limit(1)
    
    if (tipsError) {
      console.log('   ❌ Tips table:', tipsError.message)
      results.tables.tips = false
      results.errors.push(`Tips table error: ${tipsError.message}`)
    } else {
      console.log('   ✅ Tips table exists')
      results.tables.tips = true
    }

    // Test 4: Test real-time subscription
    console.log('\n4. Testing Real-time:')
    const testChannel = supabase
      .channel('test-connection')
      .on('postgres_changes', { event: '*', schema: 'public', table: tipsTable }, () => {})
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('   ✅ Real-time subscription works')
          results.realtime = true
          supabase.removeChannel(testChannel)
        } else {
          console.log('   ⚠️  Real-time subscription:', status)
          results.realtime = false
        }
      })

    // Summary
    console.log('\n================================')
    console.log('📊 Connection Test Summary:')
    console.log('================================')
    console.log('Connection:', results.connection ? '✅ Connected' : '❌ Failed')
    console.log('Events Table:', results.tables.events ? '✅ Exists' : '❌ Missing')
    console.log('Tips Table:', results.tables.tips ? '✅ Exists' : '❌ Missing')
    console.log('Real-time:', results.realtime ? '✅ Working' : '⚠️  Not tested')
    
    if (results.errors.length > 0) {
      console.log('\n⚠️  Issues Found:')
      results.errors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error}`)
      })
    } else {
      console.log('\n✅ All tests passed! Supabase is properly configured.')
    }

    return results
  } catch (error) {
    console.error('❌ Test failed:', error)
    results.errors.push(`Test error: ${error.message}`)
    return results
  }
}

// Make it available globally for easy testing
if (typeof window !== 'undefined') {
  window.testSupabase = testSupabaseConnection
}

