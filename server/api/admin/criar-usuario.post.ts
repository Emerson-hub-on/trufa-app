// server/api/admin/criar-usuario.post.ts
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, role = 'user' } = body

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Mostra erro claro se as variáveis não estiverem definidas
  if (!supabaseUrl || !serviceRoleKey) {
    throw createError({
      statusCode: 500,
      message: `Variáveis de ambiente ausentes: ${!supabaseUrl ? 'SUPABASE_URL ' : ''}${!serviceRoleKey ? 'SUPABASE_SERVICE_ROLE_KEY' : ''}`,
    })
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

  // Cria o usuário no Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    throw createError({
      statusCode: 400,
      message: authError?.message ?? 'Erro ao criar usuário no Auth',
    })
  }

  // Aguarda um momento para o trigger do Supabase criar o perfil
  await new Promise(resolve => setTimeout(resolve, 500))

  // Atualiza o perfil com a role
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ role, ativo: true })
    .eq('id', authData.user.id)

  if (profileError) {
    throw createError({
      statusCode: 400,
      message: `Usuário criado mas erro no perfil: ${profileError.message}`,
    })
  }

  return { success: true, id: authData.user.id }
})