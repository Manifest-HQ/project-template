<template>
  <div class="container mx-auto p-4">
    <h1 class="font-bold mb-8 text-4xl text-center">
      Welcome to the Gym Routine Tracker
    </h1>
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="font-semibold mb-4 text-2xl">Main Content</h2>
      <p class="mb-6">{{ mainContent }}</p>
      <template v-if="user && user.length">
        <div v-for="(u, index) in user" :key="index" class="mb-6">
          <h3 class="font-semibold text-xl">User: {{ u.name }}</h3>
          <p class="text-gray-600">Email: {{ u.email }}</p>
          <ul class="list-disc list-inside mt-2">
            <li>Workouts Completed: {{ u.workouts?.length ?? 0 }}</li>
            <li>Progress Records: {{ u.progress?.length ?? 0 }}</li>
            <li>Timer Entries: {{ u.timer?.length ?? 0 }}</li>
          </ul>
        </div>
      </template>
      <p v-else class="text-center text-gray-500">No users available</p>
    </section>

    <Carousel class="max-w-xs relative w-full">
      <CarouselContent>
        <CarouselItem v-for="(_, index) in 5" :key="index">
          <div class="p-1">
            <Card>
              <CardContent
                class="aspect-square flex items-center justify-center p-6">
                <span class="font-semibold text-4xl">{{ index + 1 }}</span>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

    <Calendar
      v-model="value"
      :weekday-format="'short'"
      class="border rounded-md" />

    <Card>
      <CardContent>
        <p>Hello</p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useStoreDB } from '@/stores/DB'
import {
  type DateValue,
  getLocalTimeZone,
  today
} from '@internationalized/date'

const value = ref(today(getLocalTimeZone())) as Ref<DateValue>

const storeDB = useStoreDB()
const mainContent = 'Main content of the index page'

const user = storeDB.tables.user ?? []
</script>
