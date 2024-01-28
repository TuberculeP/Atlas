<script setup lang="ts">
import { GRecipe } from 'atlas/types';

const props = defineProps<GRecipe>()
</script>

<template>
<div class="recipe">
    <h3>{{ props.output.name }}</h3>
    <img :src="props.output.image" alt="">
    <ul>
        <li v-for="{component, amount} in props.components">
            {{ component.name }} x {{ amount }}
        </li>
    </ul>
</div>
</template>

<style>
.recipe {
    border: 1px solid white;
    padding: 1rem;
    margin: 1rem;
}
</style>