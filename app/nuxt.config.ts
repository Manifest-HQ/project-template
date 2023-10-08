// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
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
  }
})
