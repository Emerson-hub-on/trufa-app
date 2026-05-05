// server/api/admin/usuarios.get.ts
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({ statusCode: 400, message: error.message })
  }

  return data
})