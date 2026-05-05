// server/api/admin/atualizar-usuario.post.ts
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, role, ativo, password } = body

  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (password) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(id, { password })
    if (error) throw createError({ statusCode: 400, message: error.message })
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ role, ativo })
    .eq('id', id)

  if (error) throw createError({ statusCode: 400, message: error.message })

  return { success: true }
})