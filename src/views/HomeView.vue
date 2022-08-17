<script setup lang="ts">
import { ref } from 'vue';
import axios from "axios"

const searchQuery = ref("")
const queryTimeout = ref()
const mapboxAPIKey = 'pk.eyJ1IjoidGFpbmtyaW9zIiwiYSI6ImNsNnVzZXhjMDFnMHUzZHBibTNlajd1c24ifQ.W017kDT4jrcrBMfAUWZdQg'
const mapboxSearchResults = ref()

const getSearchResults = () => {
  clearTimeout(queryTimeout.value)
  queryTimeout.value = setTimeout(async() => {
    if (searchQuery.value !== '') {
      const result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxAPIKey}&types=place`)
      mapboxSearchResults.value = result.data.features
      console.log(mapboxSearchResults.value)
      return
    }
    mapboxSearchResults.value = null
  }, 300)
}
</script>

<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input 
        type="text"
        v-model="searchQuery"
        @input="getSearchResults"
        placeholder="Search for a city" 
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004e71]"
      >
      <ul 
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 top-[66px]"
        v-if="mapboxSearchResults"
      >
        <li 
          v-for="searchResult in mapboxSearchResults"   :key="searchResult.id"
          class="py-2 cursor-pointer"
        >
        {{searchResult.place_name}}
        </li>
      </ul>
    </div>
  </main>
</template>
