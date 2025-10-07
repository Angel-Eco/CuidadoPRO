-- Migration: Add foto_url column to profesionales table
-- Run this in your Supabase SQL editor

ALTER TABLE profesionales 
ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- Add comment to document the column
COMMENT ON COLUMN profesionales.foto_url IS 'URL pública de la foto del profesional almacenada en Supabase Storage';

