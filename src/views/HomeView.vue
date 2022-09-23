<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input type="text" v-model="searchQuery" @input="getSearchResults" placeholder="Search for a city"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004e71]">
      <ul class="absolute bg-weather-secondary text-white w-full shadow-md py-2 top-[66px]" v-if="mapboxSearchResults">
        <p class="py-2" v-if="searchError">Sorry, something get wrong. Please try again.</p>
        <p class="py-2 px-2" v-if="!searchError && mapboxSearchResults.length === 0">No results match your query, try a
          different term.</p>
        <template v-else>
          <li v-for="searchResult in mapboxSearchResults" :key="searchResult.id" @click="previewCity(searchResult)"
            class="py-2 cursor-pointer">
            {{ searchResult.place_name }}
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          <CityCardSkeleton />
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from "axios"
import { useRouter, type LocationQueryValue } from 'vue-router';
import CityList from '@/components/CityList.vue';
import CityCardSkeleton from '../components/CityCardSkeleton.vue';


const searchQuery = ref("")
const queryTimeout = ref()
const mapboxAPIKey = 'pk.eyJ1IjoidGFpbmtyaW9zIiwiYSI6ImNsNnVzZXhjMDFnMHUzZHBibTNlajd1c24ifQ.W017kDT4jrcrBMfAUWZdQg'
const mapboxSearchResults = ref()
const searchError = ref()
const router = useRouter()

const previewCity = (searchResult: { place_name: { split: (arg0: string) => [any, any]; }; geometry: { coordinates: any[]; }; }) => {
  const [city, state] = searchResult.place_name.split(',')
  router.push({
    name: 'cityView',
    params: { state, city },
    query: {
      lat: searchResult.geometry.coordinates[1],
      lng: searchResult.geometry.coordinates[0],
      preview: true as unknown as LocationQueryValue
    }
  })
}

const getSearchResults = () => {
  clearTimeout(queryTimeout.value)
  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== '') {
      try {
        const result = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxAPIKey}&types=place`
        )
        mapboxSearchResults.value = result.data.features
      } catch {
        searchError.value = true
      }
      return
    }
    mapboxSearchResults.value = null
  }, 300)
}
</script>
