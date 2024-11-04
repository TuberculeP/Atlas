<script setup lang="ts">
import { VueFlow, useVueFlow, type Node, type Edge } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import CustomEdge from "~/src/components/CustomEdge.vue";
import CustomNode from "~/src/components/CustomNode.vue";
import TestNode from "@/components/test/TestNode.vue";

const { onConnect, addEdges, onPaneReady, fitView, snapToGrid, on } =
  useVueFlow();

snapToGrid.value = true;

const nodes = ref<Node[]>([
  { id: "1", type: "test", label: "Node 1", position: { x: 100, y: -100 } },
]);
const edges = ref<Edge[]>([]);

const nodeCounter = computed(() => nodes.value.length);

onConnect((params) => {
  addEdges([params]);
});

// event handler
onPaneReady((instance) => instance.fitView());

const onEnableSubnodes = (value: { parent: string; data: any }) => {
  console.log("Enable subnodes", value);
  const parent =
    nodes.value.find((node) => node.id === value.parent) || nodes.value[0];
  const newSubnode = {
    id: `subnode-${nodeCounter.value + 1}`,
    type: "test",
    label: "Subnode",
    position: { x: parent.position.x + 200, y: parent.position.y + 200 },
  };
  nodes.value.push(newSubnode);
  edges.value.push({
    id: `e${value.parent}-${newSubnode.id}`,
    source: value.parent,
    target: newSubnode.id,
  });
};
</script>

<template>
  <ClientOnly>
    <div class="flow-container">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        fit-view-on-init
        class="vue-flow-basic-example"
        :default-zoom="2"
        :min-zoom="0.2"
        :max-zoom="4"
      >
        <Background pattern-color="#aaa" :gap="8" />

        <MiniMap />

        <Controls />

        <template #node-custom="nodeProps">
          <CustomNode v-bind="nodeProps" />
        </template>

        <template #edge-custom="edgeProps">
          <CustomEdge v-bind="edgeProps" />
        </template>
        <template #node-test="nodeProps">
          <TestNode :node="nodeProps" @enable-subnodes="onEnableSubnodes" />
        </template>
      </VueFlow>
    </div>
  </ClientOnly>
</template>

<style lang="scss">
@import "@vue-flow/core/dist/style.css";

@import "@vue-flow/core/dist/theme-default.css";
@import "@vue-flow/controls/dist/style.css";
@import "@vue-flow/minimap/dist/style.css";

.flow-container {
  height: 100vh;
  width: 100vw;
  position: fixed;
}
</style>
