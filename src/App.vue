<template>
  <div id="app">
    <PostList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PostList from '../src/components/PostList.vue';

export default defineComponent({
  name: 'App',
  components: {
    PostList
  }
});
</script>
