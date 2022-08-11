<template>
  <div class="flex flex-col min-h-screen font-Jakarta bg-weather-primary">
    <SiteNavigation />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import SiteNavigation from './components/SiteNavigation.vue';
</script>