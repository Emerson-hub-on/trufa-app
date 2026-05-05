export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/supabase'],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: [],
    },
    types: '~/types/supabase.ts'
  },
  vite: {
    server: {
      allowedHosts: ['prudishly-dynamite-festive.ngrok-free.dev']
    }
  }
})