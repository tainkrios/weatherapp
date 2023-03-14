<template>
  <div class="flex flex-col flex-1 items-center">
    <!-- Banner -->
    <div v-if="route.query.preview" class="text-white p-4 bg-weather-secondary w-full text-center">
      <p>You are currently previewing this city, click the "+" icon to start tracking this city</p>
    </div>
    <!-- Weather Overview -->
    <div class="flex flex-col items-center text-white py-12">
      <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
      <p class="text-sm mb-12 text-center">
        {{
            new Date(weatherData?.currentTime).toLocaleDateString(
              "en-us",
              {
                weekday: 'short',
                day: '2-digit',
                month: 'long'
              }
            )
        }}
        <br>
        {{
            new Date(weatherData?.currentTime).toLocaleTimeString(
              "en-us",
              {
                hour12: false
              }
            )
        }}
      </p>
      <p class="text-8xl mb-8">
        {{ Math.round(weatherData?.current.temp) }}&deg;
      </p>
      <p>
        Feels like
        {{ Math.round(weatherData?.current.feels_like) }}&deg;
      </p>
      <p class="capitalize">
        {{ weatherData?.current.weather[0].description }}
      </p>
      <img class="w-[150px] h-auto"
        :src='`http://openweathermap.org/img/wn/${weatherData?.current.weather[0].icon}@2x.png`' alt="">
    </div>
    <hr class="border-white border-opacity-10 border w-full" />
    <!-- Hourly Weather -->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">Hourly Weather</h2>
        <div class="flex gap-10 overflow-x-scroll noscroll">
          <div v-for="hourData in weatherData?.hourly" :key="hourData.dt" class="flex flex-col gap-4 items-center">
            <p class="w-[34px] whitespace-nowrap text-center text-md">
              {{
                  new Date(hourData.currentTime).toLocaleTimeString('en-us', {
                    hour: 'numeric',
                    hour12: false
                  })
              }}
            </p>
            <img class="w-auto h-[50px] object-cover"
              :src="`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`" alt="" />
            <p class="text-xl">{{ Math.round(hourData.temp) }}&deg;</p>
          </div>
        </div>
      </div>
    </div>
    <hr class="border-white border-opacity-10 border w-full" />

    <!-- Weekly Weather -->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">Weekly Weather</h2>
        <div v-for="day in weatherData?.daily" :key="day.dt" class="flex items-center">
          <p class="flex-1">
            {{
                new Date(day.dt * 1000).toLocaleDateString(
                  'en-us',
                  {
                    weekday: 'long'
                  }
                )
            }}
          </p>
          <img class="w-[50px] h-[50px] object-cover"
            :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`" alt="" />
          <div class="flex gap-2 flex-1 justify-end">
            <p>Max: {{ Math.round(day.temp.max) }}&deg;</p>
            <p>Min: {{ Math.round(day.temp.min) }}&deg;</p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="route.query.id"
      class="flex items-center gap-2 py-12 text-white cursor-pointer hover:text-red-500 duration-150"
      @click="removeCity"
    >
      <i class="fa-solid fa-trash-can"></i>
      <p>Remove city</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { useRoute, useRouter, type LocationQueryValue } from 'vue-router';

const route = useRoute()
const router = useRouter()
const APIKey = 'f5352e084d98d5876fd9a6a2504e64e9'

const getWeatherData = async () => {
  try {
    const weatherData = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${route.query.lat}&lon=${route.query.lng}&appid=${APIKey}&units=metric`)

    //call current date & time
    const localOffset = new Date().getTimezoneOffset() * 60000
    const utc = weatherData.data.current.dt * 1000 + localOffset
    weatherData.data.currentTime = utc + 1000 * weatherData.data.timezone_offset

    //call hourly weather offset
    weatherData.data.hourly.forEach((hour: { dt: number; currentTime: number; }) => {
      const utc = hour.dt * 1000 + localOffset
      hour.currentTime = utc + 1000 * weatherData.data.timezone_offset
    });

    await new Promise(res => setTimeout(res, 1000))

    return weatherData.data
  } catch (err) {
    console.error(err)
  }
}

const weatherData = await getWeatherData()

const removeCity = () => {
  const cities = JSON.parse(localStorage.getItem('savedCities') || '[]')
  const updatedCities = cities.filter((city: { id: LocationQueryValue | LocationQueryValue[]; }) => city.id !== route.query.id)
  localStorage.setItem('savedCities', JSON.stringify(updatedCities))
  router.push({
    name: 'home'
  })
}

</script>

<style>

.noscroll::-webkit-scrollbar {
  height: 0.25rem;
}

.noscroll::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 20px;
}

.noscroll::-webkit-scrollbar-track {
  background: #ddd;
  border-radius: 20px;
}
</style>