<template>
  <div class="h-screen" tag-id="tag-4F57HrTt">
    <NuxtPage tag-id="tag-Xt3h6fyE"/>
  </div>
</template>

<script setup>
import { Capacitor } from '@capacitor/core'
import { CapacitorUpdater } from '@capgo/capacitor-updater'
import { supabaseManifestDB } from '../../supabase.js'

const config = useRuntimeConfig()

let realtimeSubscription = null

onMounted(async () => {
  // TODO use this only on ios and android, not web
  CapacitorUpdater.notifyAppReady()
  initIframeMessaging()
  sendMessageHTMLBody()
  await applyLastUpdate()
  connectToProjectRealtimeUpdates()
})

function initIframeMessaging() {
  document.addEventListener('click', function (event) {
    sendMessageElementClicked(event)
    sendMessageHTMLBody()
  })
}

function sendMessageElementClicked(event) {
  const tagID = event.target.getAttribute('tag-id')
  if (!tagID) return
  // Send a message to the parent window with the clicked element's ID
  window.parent.postMessage(
    {
      type: 'elementClicked',
      tagID: tagID,
      className: event.target.className,
      tagName: event.target.tagName,
      innerText: event.target.innerText
    },
    '*'
  )
}

function sendMessageHTMLBody() {
  const htmlBody = document.body
  window.parent.postMessage(
    {
      type: 'htmlBody',
      htmlBody: htmlBody.innerHTML
    },
    '*'
  )
}
function connectToProjectRealtimeUpdates() {
  console.log('connectToProjectRealtimeUpdates')
  // disconnect from any previos connection first
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

  if (payload.new && payload.new[platform]) {
    await applyZipUpdate(payload.new.zip_url, payload.new.version)
  }
}
</script>

<style lang="sass">
@import "@/main.sass"
</style>
