<script setup lang="ts">
import { VueFlow, useVueFlow, type Node, type Edge } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import type { GComponent, RecursiveTree } from "~/types";
import { useGraphStore } from "~/store/graphStore";
import _ from "lodash";

const { onConnect, addEdges, onPaneReady, fitView, snapToGrid } = useVueFlow();

// Atlas
const { graph, test } = useGraphStore();
const currentTree = reactive<RecursiveTree>({
  node_id: "1",
  item: test.paraffinium as GComponent,
  quantity: 1,
});

watch(
  () => _.cloneDeep(currentTree),
  (newValue, oldValue) => {
    const checkSubs = (node: RecursiveTree, oldNode?: RecursiveTree) => {
      if (
        (node.subs && (!oldNode || node.subs !== oldNode.subs)) ||
        (!node.subs && oldNode?.subs)
      ) {
        oldNode && handleSubChange(node, oldNode);
      }
      node.subs?.forEach((subNode, index) => {
        checkSubs(subNode, oldNode?.subs ? oldNode.subs[index] : undefined);
      });
    };
    checkSubs(currentTree, oldValue);
  },
  { deep: true }
);

const nodes = ref<Node[]>([
  {
    id: "1",
    type: "test",
    label: "Node 1",
    position: { x: 100, y: -100 },
    data: currentTree,
  },
]);

const edges = ref<Edge[]>([]);

function areNodesEqual(node1: RecursiveTree, node2: RecursiveTree) {
  const testableNode1 = {
    item: node1.item?.value.Id,
    subs: node1.subs?.map((sub) => sub.item?.value.Id),
  };
  const testableNode2 = {
    item: node1.item?.value.Id,
    subs: node2.subs?.map((sub) => sub.item?.value.Id),
  };
  return _.isEqual(testableNode1, testableNode2);
}

function recursivelyCleanNodes(tree: RecursiveTree) {
  console.log("node to clean : ", tree.item?.value.Name, _.cloneDeep(tree));
  // clear children nodes
  tree.subs?.forEach((subNode) => recursivelyCleanNodes(subNode));
  // clear existing subnodes
  const childrenIds = edges.value
    .filter((edge) => edge.source === tree.node_id)
    .map((edge) => edge.target);
  edges.value = edges.value.filter(
    (edge) => !childrenIds.includes(edge.target)
  );
  nodes.value = nodes.value.filter((node) => !childrenIds.includes(node.id));
}

function handleSubChange(
  modifiedSubTree: RecursiveTree,
  precedentSubTree: RecursiveTree
) {
  const mustKeep = areNodesEqual(modifiedSubTree, precedentSubTree);
  if (mustKeep) {
    return;
  }
  const { node_id: parentId, subs } = modifiedSubTree;

  recursivelyCleanNodes(precedentSubTree);

  subs?.forEach((subNode, i) => {
    const existingNode = nodes.value.find(
      (node) => node.id === subNode.node_id
    );
    if (!existingNode) {
      // Coodinates calculation : we need to set the new node below its parent, and to the right of its siblings
      const parent = nodes.value.find((node) => node.id === parentId);
      // align and then center
      const x =
        (parent?.position.x || 0) + i * 400 + 225 - (subs.length * 400) / 2;
      const y = (parent?.position.y || 0) + 200;
      nodes.value.push({
        id: subNode.node_id,
        type: "test",
        label: `Node ${subNode.node_id}`,
        position: { x, y },
        data: subNode,
      });
      edges.value.push({
        id: `e${parentId}-${subNode.node_id}`,
        source: parentId,
        target: subNode.node_id,
      });
    }
  });
}

// Vue Flow
snapToGrid.value = true;
const nodeCounter = computed(() => nodes.value.length);
onConnect((params) => {
  addEdges([params]);
});
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
        <template #node-test="nodeProps">
          <div class="node">
            <NodeTree :graph="graph" :node="nodeProps" />
          </div>
        </template>
        <Background pattern-color="#aaa" :gap="8" />
        <MiniMap />
        <Controls />
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

<style scoped>
.node {
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
}
</style>
