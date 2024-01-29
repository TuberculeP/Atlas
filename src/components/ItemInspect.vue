<script setup lang="ts">
import ItemImage from "./ItemUtils/ItemImage.vue";
import useDescriptionParser from "../composables/useDescriptionParser";
import { useGraphStore } from "~/store/graphStore";

const props = defineProps<{ id: string | null }>();

const { graph } = useGraphStore();

const item = ref(graph.get(props.id ?? ""));

watch(
  () => props.id,
  (newId) => {
    item.value = graph.get(newId ?? "");
  }
);

const { parseDescription } = useDescriptionParser();
</script>

<template>
  <ClientOnly>
    <div class="inspect">
      <template v-if="item">
        <h1>{{ item.value.Name }}</h1>
        <ItemImage :id="item.value.Id" />
        <pre>{{ item.value.Id }}</pre>
        <p v-html="parseDescription(item.value.Description)" />
        <NuxtLink :to="'/output/' + item.value.Id"
          >See potential crafts</NuxtLink
        >
      </template>
    </div>
  </ClientOnly>
</template>

<style scoped lang="scss">
div.inspect {
  width: 100%;
  padding: 20px;
  height: 100vh;
  overflow: scroll;
  background-color: rgb(0, 0, 0);
  color: white;
}
h1 {
  text-align: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid gray;
}

p {
  margin: 10px 0;
  line-height: 1.2;
}
</style>
