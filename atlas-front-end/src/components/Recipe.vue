<script setup lang="ts">
import { GRecipe } from '../recipes/utils';

const props = defineProps<{
    recipe: GRecipe;
}>()
</script>

<template>
<h1>{{ props.recipe.output.name }}</h1>
</template>