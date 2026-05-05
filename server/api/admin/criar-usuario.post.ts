// server/api/admin/criar-usuario.post.ts
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, role = 'user' } = body

  // Usa a Service Role Key (só existe no servidor)
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Cria o usuário no Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // já confirma o e-mail automaticamente
  })

  if (authError || !authData.user) {
    throw createError({ statusCode: 400, message: authError?.message ?? 'Erro ao criar usuário' })
  }

  // Atualiza o perfil com a role desejada
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ role, ativo: true })
    .eq('id', authData.user.id)

  if (profileError) {
    throw createError({ statusCode: 400, message: profileError.message })
  }

  return { success: true, id: authData.user.id }
})