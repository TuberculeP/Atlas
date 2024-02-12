<script setup lang="ts">
import type { Comp } from "~/types";
import LeaderLine from "leader-line-new";
import { useGraphlineStore } from "~/store/graphline.store";

const comp = defineProps<Comp>();
const { updateAllLines, addLine } = useGraphlineStore();

function addChild() {
  comp.children.push({
    name: comp.name + "child" + comp.children.length,
    children: [],
  });
  nextTick(() => {
    comp.children.forEach((child) => {
      addLine(
        new LeaderLine(
          document.getElementById(comp.name),
          document.getElementById(child.name),
          {
            color: "red",
            size: 2,
            startPlug: "square",
            endPlug: "square",
            path: "fluid",
            startSocket: "auto",
            endSocket: "left",
          }
        )
      );
    });
  });
}

function getChildSum({ children }: Comp): number {
  if (!children.length) return 1;
  return children.reduce((acc, child) => {
    return acc + getChildSum(child);
  }, 0);
}

const lowestLevelChildren = computed<number>(() => {
  return getChildSum(comp);
});
</script>

<template>
  <div class="step">
    <div class="node" ref="thisNode" :id="comp.name">
      <h1>test</h1>
      <p>J'ai {{ lowestLevelChildren }} enfants le plus bas</p>
      <button @click="addChild">+</button>
    </div>
    <div class="children" v-if="children.length" ref="childrenWrapper">
      <CanvasNode v-for="child in children" v-bind="child" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.step {
  margin: 0 20px;
  gap: 30px;
  display: flex;
}
.children {
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: relative;
}
.node {
  box-sizing: content-box;
  width: 100px;
  height: 100px;
  background-color: #f00;
  border-radius: 10%;
  padding: 20px;
  button {
    background-color: white;
    font-weight: bold;
    border: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: large;
    &:hover {
      background-color: red;
      border: 2px solid white;
      color: white;
    }
  }
}
</style>
