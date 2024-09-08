import { defineStore } from 'pinia'
import { Capacitor } from '@capacitor/core'
import { CapacitorUpdater } from '@capacitor/updater'
import { supabaseManifestDB } from '../../supabase.js'

// TODO use this only on ios and android, not web
CapacitorUpdater.notifyAppReady()

export const useStoreDB = defineStore('DB', () => {
  let realtimeSubscription = null

  const config = useRuntimeConfig()

  function connectToAppReleases() {
    console.log('connectToAppReleases')
    // disconnect from any previous connection first
    disconnectFromProjectRealtimeUpdates()

    const projectId = config.public.PROJECT_ID
    const filter = `project_id=eq.${projectId}`

    // connect to the realtime updates
    realtimeSubscription = supabaseManifestDB
      .channel('app-updates-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'app_updates',
          filter: filter
        },

        async (payload) => {
          await handleUpdates(payload)
        }
      )
      .subscribe()
  }

  function disconnectFromProjectRealtimeUpdates() {
    if (realtimeSubscription) {
      realtimeSubscription.unsubscribe()
      realtimeSubscription = null
    }
  }

  async function applyZipUpdate(zipUrl, appVersion) {
    console.log('applying update', zipUrl, appVersion)
    try {
      const version = await CapacitorUpdater.download({
        url: zipUrl,
        version: appVersion
      })
      console.log('downloaded version', version)
      await CapacitorUpdater.set(version)
      console.log('update applied, reloading app')
    } catch (error) {
      console.error('Error applying update:', error)
    }
  }

  async function applyLastUpdate() {
    const platform = Capacitor.getPlatform()
    if (platform === 'web') return
    const { data, error } = await supabaseManifestDB
      .from('app_updates')
      .select('*')
      .eq('project_id', config.public.PROJECT_ID)
      .match({ [platform]: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('error:', error)
      return
    }

    if (data.length === 0) {
      console.log('no updates found')
      return
    }

    await applyZipUpdate(data[0].zip_url, data[0].version)
  }

  async function handleUpdates(payload) {
    console.log(payload)
    const platform = Capacitor.getPlatform()

    if (platform === 'web') return

    if (
      payload.new &&
      payload.new.zip_url &&
      payload.new.version &&
      payload.new[platform] &&
      payload.new.built === true
    ) {
      await applyZipUpdate(payload.new.zip_url, payload.new.version)
    }
  }

  async function init() {
    await applyLastUpdate()
    connectToAppReleases()
  }

  return { init }
})
