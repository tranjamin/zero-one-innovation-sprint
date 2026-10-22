import { createClient } from '@supabase/supabase-js';
// Public read-only key supplied for the external demo dataset. No session or writes.
export const supabase = createClient('https://qiyxyrmlvlcqdoliredt.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeXh5cm1sdmxjcWRvbGlyZWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NzEwNDAsImV4cCI6MjEwODI0NzA0MH0.dRc_IQ489-vjen3diBKor5__yg8i0RfHHjLOPgTDaD8', {auth:{persistSession:false, autoRefreshToken:false, detectSessionInUrl:false}});
