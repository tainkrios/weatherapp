<template>
  <div>
    <Suspense>
      <AsyncCityView />
    </Suspense>
</div>
</template>

<script setup lang="ts">
import AsyncCityView from "./AsyncCityView.vue";

</script>