<template>
  <div tag-id="tag-GlFDY8HX">
    <h2
      class="font-semibold leading-6 text-base text-gray-900"
      tag-id="tag-jphKkQGs">
      Upcoming meetings
    </h2>
    <div class="lg:grid lg:grid-cols-12 lg:gap-x-16" tag-id="tag-iVeug89t">
      <div
        class="lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9 mt-10 text-center"
        tag-id="tag-4mPRGQcA">
        <div class="flex items-center text-gray-900" tag-id="tag-LBh6EZLF">
          <button
            type="button"
            class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            tag-id="tag-sLcyfRhg">
            <span class="sr-only" tag-id="tag-TaQMTQ4a">Previous month</span>
            <ChevronLeftIcon
              class="h-5 w-5"
              aria-hidden="true"
              tag-id="tag-YWcbPfK4" />
          </button>
          <div class="flex-auto font-semibold text-sm" tag-id="tag-6pEY5umI">
            January
          </div>
          <button
            type="button"
            class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            tag-id="tag-5UkIeL81">
            <span class="sr-only" tag-id="tag-FUM8QlkR">Next month</span>
            <ChevronRightIcon
              class="h-5 w-5"
              aria-hidden="true"
              tag-id="tag-LHr6F8c2" />
          </button>
        </div>
        <div
          class="grid grid-cols-7 leading-6 mt-6 text-gray-500 text-xs"
          tag-id="tag-jJUxMcSs">
          <div tag-id="tag-NU1KlrMq">M</div>
          <div tag-id="tag-6GepwXUH">T</div>
          <div tag-id="tag-9qBBF1PV">W</div>
          <div tag-id="tag-8abWlVdB">T</div>
          <div tag-id="tag-cj9ct3LK">F</div>
          <div tag-id="tag-HRuhqI3N">S</div>
          <div tag-id="tag-nZA5cKK6">S</div>
        </div>
        <div
          class="bg-gray-200 gap-px grid grid-cols-7 isolate mt-2 ring-1 ring-gray-200 rounded-lg shadow text-sm"
          tag-id="tag-BfShux9n">
          <button
            v-for="(day, dayIdx) in days"
            :key="day.date"
            type="button"
            :class="['py-1.5 hover:bg-gray-100 focus:z-10', day.isCurrentMonth ? 'bg-white' : 'bg-gray-50', (day.isSelected || day.isToday) &amp;&amp; 'font-semibold', day.isSelected &amp;&amp; 'text-white', !day.isSelected &amp;&amp; day.isCurrentMonth &amp;&amp; !day.isToday &amp;&amp; 'text-gray-900', !day.isSelected &amp;&amp; !day.isCurrentMonth &amp;&amp; !day.isToday &amp;&amp; 'text-gray-400', day.isToday &amp;&amp; !day.isSelected &amp;&amp; 'text-indigo-600', dayIdx === 0 &amp;&amp; 'rounded-tl-lg', dayIdx === 6 &amp;&amp; 'rounded-tr-lg', dayIdx === days.length - 7 &amp;&amp; 'rounded-bl-lg', dayIdx === days.length - 1 &amp;&amp; 'rounded-br-lg']"
            tag-id="tag-bEvFcmIr">
            <time
              :datetime="day.date"
              :class="['mx-auto flex h-7 w-7 items-center justify-center rounded-full', day.isSelected &amp;&amp; day.isToday &amp;&amp; 'bg-indigo-600', day.isSelected &amp;&amp; !day.isToday &amp;&amp; 'bg-gray-900']"
              tag-id="tag-3GXMSV1W"
              >{{ day.date.split(&apos;-&apos;).pop().replace(/^0/, &apos;&apos;) }}</time
            >
          </button>
        </div>
        <button
          type="button"
          class="bg-primary hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-semibold mt-8 px-3 py-2 rounded-md shadow text-sm text-white w-full"
          tag-id="tag-rs1RUPnQ">
          Add event
        </button>
      </div>
      <ol
        class="lg:col-span-7 xl:col-span-8 divide-gray-100 divide-y leading-6 mt-4 text-sm"
        tag-id="tag-XmFmlnt8">
        <li
          v-for="meeting in meetings"
          :key="meeting.id"
          class="xl:static flex py-6 relative space-x-6"
          tag-id="tag-T1jxd6S9">
          <img
            :src="meeting.imageUrl"
            alt=""
            class="flex-none h-14 rounded-full w-14"
            tag-id="tag-8G4S7sxM" />
          <div class="flex-auto" tag-id="tag-cYjrWiCU">
            <h3
              class="xl:pr-0 font-semibold pr-10 text-gray-900"
              tag-id="tag-4DCgTIZZ">
              {{ meeting.name }}
            </h3>
            <dl
              class="xl:flex-row flex flex-col mt-2 text-gray-500"
              tag-id="tag-8TmVT3k4">
              <div class="flex items-start space-x-3" tag-id="tag-m7dvtvl7">
                <dt class="mt-0.5" tag-id="tag-YiltqnFc">
                  <span class="sr-only" tag-id="tag-Pc3frJIW">Date</span>
                  <CalendarIcon
                    class="h-5 text-gray-400 w-5"
                    aria-hidden="true"
                    tag-id="tag-jhJKEbkG" />
                </dt>
                <dd tag-id="tag-Acgm99d8">
                  <time :datetime="meeting.datetime" tag-id="tag-qVEN31Bb"
                    >{{ meeting.date }} at {{ meeting.time }}</time
                  >
                </dd>
              </div>
              <div
                class="mt-2 flex items-start space-x-3 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5"
                tag-id="tag-AqbkaSNh">
                <dt class="mt-0.5" tag-id="tag-ATNuDck4">
                  <span class="sr-only" tag-id="tag-VPUsgasf">Location</span>
                  <MapPinIcon
                    class="h-5 text-gray-400 w-5"
                    aria-hidden="true"
                    tag-id="tag-aSGQvwnE" />
                </dt>
                <dd tag-id="tag-JubgAfRM">{{ meeting.location }}</dd>
              </div>
            </dl>
          </div>
          <Menu
            as="div"
            class="xl:relative xl:right-auto xl:top-auto xl:self-center absolute right-0 top-6"
            tag-id="tag-vU5AIUL9">
            <div tag-id="tag-W53klPIr">
              <MenuButton
                class="-m-2 hover:text-gray-600 flex items-center p-2 rounded-full text-gray-500"
                tag-id="tag-pNZsczG1">
                <span class="sr-only" tag-id="tag-y81nd2AF">Open options</span>
                <EllipsisHorizontalIcon
                  class="h-5 w-5"
                  aria-hidden="true"
                  tag-id="tag-7Ii4X1mb" />
              </MenuButton>
            </div>

            <transition
              enter-active-class="duration-100 ease-out transition"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="duration-75 ease-in transition"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
              tag-id="tag-AWlGpRF6">
              <MenuItems
                class="ring-opacity-5 focus:outline-none absolute bg-white mt-2 origin-top-right right-0 ring-1 ring-black rounded-md shadow-lg w-36 z-10"
                tag-id="tag-tYrxZXLw">
                <div class="py-1" tag-id="tag-5rBLPiZp">
                  <MenuItem v-slot="{ active }" tag-id="tag-d3yvV5iI">
                    <a
                      href="#"
                      :class="[
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      ]"
                      tag-id="tag-psPlBCLT"
                      >Edit</a
                    >
                  </MenuItem>
                  <MenuItem v-slot="{ active }" tag-id="tag-9XSKuuMt">
                    <a
                      href="#"
                      :class="[
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      ]"
                      tag-id="tag-2y8uAIgd"
                      >Cancel</a
                    >
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
    location: 'Starbucks'
  }
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
  { date: '2022-02-06' }
]
</script>
