import { defineStore } from 'pinia';
import axios from 'axios';
import { notification } from 'ant-design-vue';
import Post from '@/models/Post';

// Определение хранилища usePostStore
export const usePostStore = defineStore({
  id: 'post',
  state: () => ({
    posts: [] as Post[],
    loadingPosts: true,
  }),
  actions: {
    async fetchPosts() {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        this.posts = response.data;
      } catch (error) {
        console.error('Ошибка при загрузке списка постов:', error);
      } finally {
        this.loadingPosts = false;
      }
    },
    async createPost(newPost: Post) {
      try {
        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', newPost);
        this.posts.unshift(response.data);
        console.log('Пост успешно создан:', response.data);
      } catch (error) {
        console.error('Ошибка при создании поста:', error);
      }
    },
    async updatePost(updatedPost: Post) {
      try {
        await axios.put(`https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`, updatedPost);
        const index = this.posts.findIndex(post => post.id === updatedPost.id);
        if (index !== -1) {
          this.posts[index] = updatedPost;
        }
        console.log('Пост успешно обновлен:', updatedPost);
      } catch (error) {
        console.error('Ошибка при обновлении поста:', error);
      }
    },
    async deletePost(postId: number) {
      try {
        await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        this.posts = this.posts.filter(post => post.id !== postId);
        console.log('Пост успешно удален');
        notification.success({
          message: 'Success',
          description: 'Post successfully deleted',
        });
      } catch (error) {
        console.error('Ошибка при удалении поста:', error);
      }
    },
  },
});
