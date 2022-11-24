<template>
  <div class="flex flex-col bg-neutral-gray">
    <div class="h-1/2 flex items-center justify-center">
      <img src="~/assets/logo.svg" />
    </div>
    <div class="flex h-1/2 items-end">
      <div class="shrink-0">
        <img src="~/assets/mascot.png" />
      </div>
      <div class="text-white mr-6 mb-6">
        <h2 class="text-white text-2xl font-bold mb-3">Welcome back!</h2>
        <p class="mb-12">
          Sign In to find opportunities that match your interests. We have both
          part-time and full-time roles that can be done online and in-person.
        </p>
        <div class="flex gap-1">
          <div class="w-4 bg-white h-1 rounded-full"></div>
          <div class="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div class="w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
        <p class="mt-12">
          Please contact us at +91-9380644532 if you need any assistance.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'SideBar',
})
</script>
