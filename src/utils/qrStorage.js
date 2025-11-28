/**
 * QR Code Storage Utilities
 * Handles saving QR codes to Supabase storage
 */

import { supabase } from '../lib/supabase'

/**
 * Upload QR code image to Supabase Storage
 */
export async function uploadQRToStorage(qrBlob, eventId, fileName) {
  try {
    const filePath = `qr-codes/${eventId}/${fileName || `qr-${Date.now()}.png`}`
    
    const { data, error } = await supabase.storage
      .from('tipnplay-assets')
      .upload(filePath, qrBlob, {
        contentType: 'image/png',
        upsert: true
      })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('tipnplay-assets')
      .getPublicUrl(filePath)

    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath
    }
  } catch (error) {
    console.error('Error uploading QR code:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Get QR code from storage
 */
export async function getQRFromStorage(eventId) {
  try {
    const { data, error } = await supabase.storage
      .from('tipnplay-assets')
      .list(`qr-codes/${eventId}`, {
        limit: 1,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) throw error

    if (data && data.length > 0) {
      const { data: urlData } = supabase.storage
        .from('tipnplay-assets')
        .getPublicUrl(data[0].name)

      return {
        success: true,
        url: urlData.publicUrl
      }
    }

    return {
      success: false,
      error: 'No QR code found'
    }
  } catch (error) {
    console.error('Error getting QR code:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Create storage bucket (run once in Supabase dashboard)
 */
export const createStorageBucket = `
-- Run this in Supabase SQL Editor to create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('tipnplay-assets', 'tipnplay-assets', true)
ON CONFLICT (id) DO NOTHING;
`

