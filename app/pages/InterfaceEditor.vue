<template>
  <div id="app">
    <div class="absolute bg-blue-500 bottom-20 left-0 w-full z-20">
      {{ iframeElements }}
    </div>

    <DraggableResizable
      v-for="(item, i) in iframeElements"
      :class-name-active="'my-active-class'"
      class-name="absolute my-class"
      :min-width="4"
      :min-height="4"
      :h="item.rect.height"
      :w="item.rect.width"
      :grid="[4, 4]"
      :x="item.rect.x"
      :y="item.rect.y"
      :id="'draggable-resizable-' + item['manifest-tag-id']"
      @drag="onDrag"
      @drag-stop="onDragStop"
      @resize-stop="onResizeStop"
      @click="setManifestTagID(item['manifest-tag-id'])">
      <div
        class="h-full w-full"
        :class="{ 'pointer-events-none select-none': !elementsClickable }"
        v-if="item['component-name']">
        <component
          :id="'component-' + i"
          class="h-full w-full"
          :is="processedComponents[item['component-name']]"
          :name="item.name"
          :text="item.text" />
      </div>

      <div
        class="h-full w-full"
        :class="{ 'pointer-events-none select-none': !elementsClickable }"
        v-else
        v-html="
          `<${item.tag} class='h-full w-full ${
            item.class || ''
          }' manifest-tag-id='${item['manifest-tag-id']}'>${
            item.textContent
          }</${item.tag}>`
        "></div>
    </DraggableResizable>

    <iframe
      class="absolute border border-red-200 h-full opacity-0 pointer-events-none right-0 top-0 w-full"
      src="/"
      id="page-iframe" />

    <div
      class="bg-white border-t border-zinc-200 bottom-0 fixed flex px-4 py-4 space-x-4 w-full">
      <Button @click="addElement('Example', 'Hover here')"
        >Add example elements</Button
      >

      <Button @click="addElement('Calendar', 'Hover here')"
        >Add calendar</Button
      >

      <Button @click="addElement('p', 'Hover here')">Add paragraph</Button>

      <Button @click="getDataFromIframe()">Get data from iframe</Button>

      <Button @click="syncDataToIframe()">Sync data to iframe</Button>

      <div class="flex items-center">
        <Checkbox
          :checked="elementsClickable"
          @click="elementsClickable = !elementsClickable" />
        <span class="ml-2">Elements clickable</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const elementsClickable = ref(false)

const components = import.meta.glob('@/components/**/*.vue', { eager: true })

const processedComponents = Object.entries(components).reduce(
  (acc, [path, module]) => {
    const componentName = path
      .replaceAll('/', '')
      .replace('.vue', '')
      .split('components')[1]
      .replace(/^[a-z-]+/, '') // Remove leading lowercase characters and dashes
    acc[componentName] = module.default
    return acc
  },
  {}
)

onMounted(() => {
  window.addEventListener('keydown', (event) => {
    console.log(event)
    if (event.key === 'Backspace') {
      handleDelete()
    }
  })
})

const route = useRoute()
const router = useRouter()

function setManifestTagID(manifestTagId) {
  router.push({
    query: {
      ...route.query,
      manifestTagId: manifestTagId
    }
  })
}

function handleDelete() {
  console.log('delete')
  const manifestTagID = route.query.manifestTagId

  if (manifestTagID) {
    iframeElements.value = iframeElements.value.filter(
      (element) => element['manifest-tag-id'] !== manifestTagID
    )
  }

  console.log(iframeElements.value)
}

function addElement(tag, text) {
  console.log('add element, tag: ', tag)
  console.log('processedComponents[tag]: ', processedComponents[tag])

  let componentName = null
  if (processedComponents[tag]) {
    componentName = tag
  }

  iframeElements.value.push({
    'component-name': componentName,
    tag,
    textContent: text,
    'manifest-tag-id': Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase(),
    rect: {
      x: 0,
      y: 0,
      width: 100,
      height: 100
    }
  })
}

const iframeElements = ref([])

async function getDataFromIframe() {
  iframeElements.value = []

  await nextTick()

  const iframe = document.getElementById('page-iframe')
  if (!iframe || !(iframe instanceof HTMLIFrameElement)) return

  const iframeDocument =
    iframe.contentDocument || iframe.contentWindow?.document
  if (!iframeDocument) return

  const nuxtDiv = iframeDocument.getElementById('__nuxt')
  if (!nuxtDiv) return

  const iframeRect = iframe.getBoundingClientRect()
  const elements = []

  function traverseDOM(node, iframeRect) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node
      const rect = element.getBoundingClientRect()

      // Calculate offset relative to the iframe
      const offsetX = rect.left
      const offsetY = rect.top

      const elementInfo = {
        tag: element.tagName.toLowerCase(),
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        },
        textContent: Array.from(element.childNodes)
          .filter((child) => child.nodeType === Node.TEXT_NODE)
          .map((child) => child.textContent.trim())
          .join(' ')
          .trim(),
        'manifest-tag-id': Math.random()
          .toString(36)
          .substring(2, 10)
          .toUpperCase()
      }

      // Add all attributes
      for (const attr of element.attributes) {
        elementInfo[attr.name] = attr.value
      }

      // Remove margin and padding from element class because we use absolute positioning here
      if (elementInfo.class) {
        elementInfo.class = elementInfo.class.replace(
          /\b([mp][xytrbl]?-\d+|-?[mp][xytrbl]?-\d+)\b/g,
          ''
        )
      }

      // Verify if element should be added
      // Remove elements with no background, border or text that aren't components
      let shouldBeAdded = false

      if (
        (elementInfo.class &&
          (elementInfo.class.includes('bg-') ||
            elementInfo.class.includes('border-'))) ||
        elementInfo.textContent
      ) {
        shouldBeAdded = true
      }

      if (shouldBeAdded) {
        elements.push(elementInfo)
      }

      // Traverse child nodes
      for (const child of element.children) {
        traverseDOM(child, iframeRect)
      }
    }
  }

  traverseDOM(nuxtDiv, iframeRect)

  iframeElements.value = elements
  console.log(elements)
}

async function syncDataToIframe() {
  console.log('syncing data to iframe')
}

function onDrag(x, y) {
  console.log('dragging', x, y)
}

function onDragStop() {
  console.log('drag stop element ' + route.query.manifestTagId)
  const element = document.getElementById(
    `draggable-resizable-${route.query.manifestTagId}`
  )

  if (element) {
    console.log(element.style.transform)
    const transformValues = element.style.transform.match(
      /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/
    )
    const x = transformValues ? parseFloat(transformValues[1]) : 0
    const y = transformValues ? parseFloat(transformValues[2]) : 0
    console.log(`Element position: ${x}px from left, ${y}px from top`)
  }
  sendPositions()
}

function onResizeStop() {
  sendPositions()
}

function sendPositions() {
  console.log('sending positions')
}
</script>

<style lang="sass">
@import 'vue-draggable-resizable/style.css'

html, body, #app
  @apply h-screen w-screen overflow-hidden

.my-class
  @apply border-[1.5px] border-transparent
  -webkit-transition: background-color 200ms linear
  -ms-transition: background-color 200ms linear
  transition: background-color 200ms linear

.my-active-class
  @apply border-blue-500 shadow-md

.handle
  @apply border border-blue-500
  height: 8px
  width: 8px

.handle-tl
  top: -5px
  left: -5px

.handle-tm
  display: none !important

.handle-tr
  top: -5px
  right: -5px

.handle-ml
  display: none !important

.handle-mr
  display: none !important

.handle-bl
  bottom: -5px
  left: -5px

.handle-bm
  display: none !important

.handle-br
  bottom: -5px
  right: -5px
</style>
