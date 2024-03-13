<template>
  <div tag-id="tag-GlFDY8HX">
    <h2 class="text-base font-semibold leading-6 text-gray-900" tag-id="tag-jphKkQGs">Upcoming meetings</h2>
    <div class="lg:grid lg:grid-cols-12 lg:gap-x-16" tag-id="tag-iVeug89t">
      <div class="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9" tag-id="tag-4mPRGQcA">
        <div class="flex items-center text-gray-900" tag-id="tag-LBh6EZLF">
          <button type="button" class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500" tag-id="tag-sLcyfRhg">
            <span class="sr-only" tag-id="tag-TaQMTQ4a">Previous month</span>
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" tag-id="tag-YWcbPfK4"/>
          </button>
          <div class="flex-auto text-sm font-semibold" tag-id="tag-6pEY5umI">January</div>
          <button type="button" class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500" tag-id="tag-5UkIeL81">
            <span class="sr-only" tag-id="tag-FUM8QlkR">Next month</span>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" tag-id="tag-LHr6F8c2"/>
          </button>
        </div>
        <div class="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500" tag-id="tag-jJUxMcSs">
          <div tag-id="tag-NU1KlrMq">M</div>
          <div tag-id="tag-6GepwXUH">T</div>
          <div tag-id="tag-9qBBF1PV">W</div>
          <div tag-id="tag-8abWlVdB">T</div>
          <div tag-id="tag-cj9ct3LK">F</div>
          <div tag-id="tag-HRuhqI3N">S</div>
          <div tag-id="tag-nZA5cKK6">S</div>
        </div>
        <div class="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200" tag-id="tag-BfShux9n">
          <button v-for="(day, dayIdx) in days" :key="day.date" type="button" :class="[&apos;py-1.5 hover:bg-gray-100 focus:z-10&apos;, day.isCurrentMonth ? &apos;bg-white&apos; : &apos;bg-gray-50&apos;, (day.isSelected || day.isToday) &amp;&amp; &apos;font-semibold&apos;, day.isSelected &amp;&amp; &apos;text-white&apos;, !day.isSelected &amp;&amp; day.isCurrentMonth &amp;&amp; !day.isToday &amp;&amp; &apos;text-gray-900&apos;, !day.isSelected &amp;&amp; !day.isCurrentMonth &amp;&amp; !day.isToday &amp;&amp; &apos;text-gray-400&apos;, day.isToday &amp;&amp; !day.isSelected &amp;&amp; &apos;text-indigo-600&apos;, dayIdx === 0 &amp;&amp; &apos;rounded-tl-lg&apos;, dayIdx === 6 &amp;&amp; &apos;rounded-tr-lg&apos;, dayIdx === days.length - 7 &amp;&amp; &apos;rounded-bl-lg&apos;, dayIdx === days.length - 1 &amp;&amp; &apos;rounded-br-lg&apos;]" tag-id="tag-bEvFcmIr">
            <time :datetime="day.date" :class="[&apos;mx-auto flex h-7 w-7 items-center justify-center rounded-full&apos;, day.isSelected &amp;&amp; day.isToday &amp;&amp; &apos;bg-indigo-600&apos;, day.isSelected &amp;&amp; !day.isToday &amp;&amp; &apos;bg-gray-900&apos;]" tag-id="tag-3GXMSV1W">{{ day.date.split(&apos;-&apos;).pop().replace(/^0/, &apos;&apos;) }}</time>
          </button>
        </div>
        <button type="button" class="mt-8 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" tag-id="tag-rs1RUPnQ">Add event</button>
      </div>
      <ol class="mt-4 divide-y divide-gray-100 text-sm leading-6 lg:col-span-7 xl:col-span-8" tag-id="tag-XmFmlnt8">
        <li v-for="meeting in meetings" :key="meeting.id" class="relative flex space-x-6 py-6 xl:static" tag-id="tag-T1jxd6S9">
          <img :src="meeting.imageUrl" alt="" class="h-14 w-14 flex-none rounded-full" tag-id="tag-8G4S7sxM"/>
          <div class="flex-auto" tag-id="tag-cYjrWiCU">
            <h3 class="pr-10 font-semibold text-gray-900 xl:pr-0" tag-id="tag-4DCgTIZZ">{{ meeting.name }}</h3>
            <dl class="mt-2 flex flex-col text-gray-500 xl:flex-row" tag-id="tag-8TmVT3k4">
              <div class="flex items-start space-x-3" tag-id="tag-m7dvtvl7">
                <dt class="mt-0.5" tag-id="tag-YiltqnFc">
                  <span class="sr-only" tag-id="tag-Pc3frJIW">Date</span>
                  <CalendarIcon class="h-5 w-5 text-gray-400" aria-hidden="true" tag-id="tag-jhJKEbkG"/>
                </dt>
                <dd tag-id="tag-Acgm99d8">
                  <time :datetime="meeting.datetime" tag-id="tag-qVEN31Bb">{{ meeting.date }} at {{ meeting.time }}</time>
                </dd>
              </div>
              <div class="mt-2 flex items-start space-x-3 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5" tag-id="tag-AqbkaSNh">
                <dt class="mt-0.5" tag-id="tag-ATNuDck4">
                  <span class="sr-only" tag-id="tag-VPUsgasf">Location</span>
                  <MapPinIcon class="h-5 w-5 text-gray-400" aria-hidden="true" tag-id="tag-aSGQvwnE"/>
                </dt>
                <dd tag-id="tag-JubgAfRM">{{ meeting.location }}</dd>
              </div>
            </dl>
          </div>
          <Menu as="div" class="absolute right-0 top-6 xl:relative xl:right-auto xl:top-auto xl:self-center" tag-id="tag-vU5AIUL9">
            <div tag-id="tag-W53klPIr">
              <MenuButton class="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:text-gray-600" tag-id="tag-pNZsczG1">
                <span class="sr-only" tag-id="tag-y81nd2AF">Open options</span>
                <EllipsisHorizontalIcon class="h-5 w-5" aria-hidden="true" tag-id="tag-7Ii4X1mb"/>
              </MenuButton>
            </div>

            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95" tag-id="tag-AWlGpRF6">
              <MenuItems class="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" tag-id="tag-tYrxZXLw">
                <div class="py-1" tag-id="tag-5rBLPiZp">
                  <MenuItem v-slot="{ active }" tag-id="tag-d3yvV5iI">
                    <a href="#" :class="[active ? &apos;bg-gray-100 text-gray-900&apos; : &apos;text-gray-700&apos;, &apos;block px-4 py-2 text-sm&apos;]" tag-id="tag-psPlBCLT">Edit</a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }" tag-id="tag-9XSKuuMt">
                    <a href="#" :class="[active ? &apos;bg-gray-100 text-gray-900&apos; : &apos;text-gray-700&apos;, &apos;block px-4 py-2 text-sm&apos;]" tag-id="tag-2y8uAIgd">Cancel</a>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

const meetings = [
  {
    id: 1,
    date: 'January 10th, 2022',
    time: '5:00 PM',
    datetime: '2022-01-10T17:00',
    name: 'Leslie Alexander',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Starbucks',
  },
  // More meetings...
]
const days = [
  { date: '2021-12-27' },
  { date: '2021-12-28' },
  { date: '2021-12-29' },
  { date: '2021-12-30' },
  { date: '2021-12-31' },
  { date: '2022-01-01', isCurrentMonth: true },
  { date: '2022-01-02', isCurrentMonth: true },
  { date: '2022-01-03', isCurrentMonth: true },
  { date: '2022-01-04', isCurrentMonth: true },
  { date: '2022-01-05', isCurrentMonth: true },
  { date: '2022-01-06', isCurrentMonth: true },
  { date: '2022-01-07', isCurrentMonth: true },
  { date: '2022-01-08', isCurrentMonth: true },
  { date: '2022-01-09', isCurrentMonth: true },
  { date: '2022-01-10', isCurrentMonth: true },
  { date: '2022-01-11', isCurrentMonth: true },
  { date: '2022-01-12', isCurrentMonth: true, isToday: true },
  { date: '2022-01-13', isCurrentMonth: true },
  { date: '2022-01-14', isCurrentMonth: true },
  { date: '2022-01-15', isCurrentMonth: true },
  { date: '2022-01-16', isCurrentMonth: true },
  { date: '2022-01-17', isCurrentMonth: true },
  { date: '2022-01-18', isCurrentMonth: true },
  { date: '2022-01-19', isCurrentMonth: true },
  { date: '2022-01-20', isCurrentMonth: true },
  { date: '2022-01-21', isCurrentMonth: true },
  { date: '2022-01-22', isCurrentMonth: true, isSelected: true },
  { date: '2022-01-23', isCurrentMonth: true },
  { date: '2022-01-24', isCurrentMonth: true },
  { date: '2022-01-25', isCurrentMonth: true },
  { date: '2022-01-26', isCurrentMonth: true },
  { date: '2022-01-27', isCurrentMonth: true },
  { date: '2022-01-28', isCurrentMonth: true },
  { date: '2022-01-29', isCurrentMonth: true },
  { date: '2022-01-30', isCurrentMonth: true },
  { date: '2022-01-31', isCurrentMonth: true },
  { date: '2022-02-01' },
  { date: '2022-02-02' },
  { date: '2022-02-03' },
  { date: '2022-02-04' },
  { date: '2022-02-05' },
  { date: '2022-02-06' },
]
</script>