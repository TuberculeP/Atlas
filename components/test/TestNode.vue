<template>
  <div class="test">
    <h1
      class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
    >
      Gold
    </h1>
    <Tabs default-value="find">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="find"> Must find it </TabsTrigger>
        <TabsTrigger value="inventory"> Already have it </TabsTrigger>
        <TabsTrigger value="recipes"> Show recipes </TabsTrigger>
      </TabsList>
      <TabsContent value="recipes">
        Test button here.
        <Button @click="onButtonClick">Enable</Button>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { NodeProps } from "@vue-flow/core";

const props = defineProps<{ node: NodeProps }>();

const emit = defineEmits<{
  (e: "enable-subnodes", value: { parent: string; data: any }): void;
  (e: "disable-subnodes", value: Object): void;
}>();

function onButtonClick() {
  const payload = { parent: props.node.id, data: {} };
  emit("enable-subnodes", payload);
}
</script>

<style scoped>
.test {
  min-width: 100px;
  gap: 4px;
  padding: 8px;
  background: white;
  border: 1px solid black;
  border-radius: 4px;
}
</style>
