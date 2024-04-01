<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import {
  AccordionHeader,
  AccordionTrigger,
  type AccordionTriggerProps,
} from 'radix-vue'
import { ChevronDownIcon } from '@radix-icons/vue'
import { cn } from '@/lib/utils'

const props = defineProps<AccordionTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <AccordionHeader class="flex" tag-id="tag-ZdeY9w4T">
    <AccordionTrigger v-bind="delegatedProps" :class="
        cn(
          &apos;flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&amp;[data-state=open]&gt;svg]:rotate-180&apos;,
          props.class,
        )
      " tag-id="tag-BlAYejvC">
      <slot tag-id="tag-uFd3sVHi"/>
      <slot name="icon" tag-id="tag-jEtEDGs4">
        <ChevronDownIcon class="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" tag-id="tag-bvScK789"/>
      </slot>
    </AccordionTrigger>
  </AccordionHeader>
</template>
