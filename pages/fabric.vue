<script setup lang="ts">
import type { Comp } from "~/types";
import { useGraphlineStore } from "~/store/graphline.store";

const { updateAllLines } = useGraphlineStore();

const firstNode = ref<Comp>({
  name: "pepito",
  children: [],
});
</script>

<template>
  <div class="fabric" @scroll="updateAllLines">
    <ClientOnly>
      <CanvasNode v-bind="firstNode" />
    </ClientOnly>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.fabric {
  height: 100vh;
  background-color: #f3f3f3;
  overflow: scroll;
}
</style>
