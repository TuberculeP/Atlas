<template>
  <Card class="ingredient">
    <div class="image">
      <img :src="item.value.CdnUrl" :alt="item.value.Name" />
    </div>
    <p class="name">{{ item.value.Name }}</p>
    <p class="quantity">x {{ quantity }}</p>
  </Card>
</template>

<script lang="ts" setup>
import type { GComponent } from "~/types";
import { Card } from "@/components/ui/card";

const props = defineProps<{
  item: GComponent;
  quantity?: number;
}>();

const color = computed(() => "#" + props.item.value.Colour);
</script>

<style scoped lang="scss">
$color: v-bind(color);

.ingredient {
  display: grid;
  grid-template-columns: auto 1fr 40px;
  gap: 10px;
  align-items: center;
  padding: 4px 8px;
  border-radius: 0;
}
.image {
  width: 32px;
  height: 32px;
  background-color: $color;
}
img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  aspect-ratio: 1/1;
}
.quantity {
  font-size: 0.6rem;
  line-height: normal;
  font-weight: bold;
  border-radius: 50px;
  box-shadow: inset 0 0 4px 1px #00000020;
  padding: 3px 5px 2px;
  text-align: center;
}
</style>
