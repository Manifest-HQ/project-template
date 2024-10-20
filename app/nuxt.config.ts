// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      viewport:
        'width=device-width, minimum-scale=1.0, maximum-scale = 1.0, user-scalable = no, viewport-fit=cover',
      script: [
        {
          src: '/font-handler.js',
          type: 'module'
        }
      ]
    }
  },

  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', 'shadcn-nuxt'],

  runtimeConfig: {
    public: {
      // do not update this, it will be overwritten by the build but it needs to be exactly this here
      // otherwise, update the build script in API (to create new projects)
      GITHUB_REPO: process.env.NUXT_PUBLIC_GITHUB_REPO,
      GITHUB_BRANCH: process.env.NUXT_PUBLIC_GITHUB_BRANCH,
      PROJECT_ID: process.env.NUXT_PUBLIC_PROJECT_ID
    }
  },

  ssr: false,

  nitro: {
    preset: 'nitro-prerender'
  },

  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  compatibilityDate: '2024-10-21',

  css: [
    '~/assets/main.sass'
    // other global CSS files...
  ]
})
