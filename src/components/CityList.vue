<template>
  <div v-for="city in savedCities" :key="city.id">
    <CityCard :city="city" @click="goToCityView(city)" />
  </div>
  <p v-if="savedCities?.length === 0">
    No locations added. To start tracking a location, search in the field above.
  </p>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CityCard from './CityCard.vue';

const savedCities = ref()
const router = useRouter()

const getCities = async () => {
  if (localStorage.getItem('savedCities')) {
    savedCities.value = JSON.parse(
      localStorage.getItem("savedCities") || '[]'
    )

    const requests: any[] = []
    savedCities.value.forEach((city: { coords: { lat: string; lng: string; }; }) => {
      requests.push(
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=f5352e084d98d5876fd9a6a2504e64e9&units=metric`
        )
      )
    })

    const weatherData = await Promise.all(requests)

    await new Promise(res => setTimeout(res, 1000))

    weatherData.forEach((item, index) => {
      savedCities.value[index].weather = item.data
    })
  }
}
await getCities()

const goToCityView = (city:
  {
    state: string,
    city: string,
    id: string,
    coords: {
      lat: string,
      lng: string;
    }
  }
) => {
  router.push({
    name: 'cityView',
    params: {
      state: city.state,
      city: city.city
    },
    query: {
      id: city.id,
      lat: city.coords.lat,
      lng: city.coords.lng
    }
  })
}
</script>