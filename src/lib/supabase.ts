import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Client opcional: enquanto as variáveis de ambiente não estiverem configuradas
// (Supabase ainda não conectado), o site continua a funcionar e o formulário de
// contacto degrada de forma graciosa. Assim que o .env estiver preenchido, o
// envio passa a gravar na tabela `leads`.
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export const isSupabaseReady = Boolean(supabase)
