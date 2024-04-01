<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { AccordionContent, type AccordionContentProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<AccordionContentProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <AccordionContent v-bind="delegatedProps" class="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" tag-id="tag-xa4mG5Qm">
    <div :class="cn(&apos;pb-4 pt-0&apos;, props.class)" tag-id="tag-1XTtdhQ4">
      <slot tag-id="tag-uXSnPKkx"/>
    </div>
  </AccordionContent>
</template>
