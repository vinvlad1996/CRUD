<template>
  <a-spin v-if="loadingPosts" />
  <div v-if="!loadingPosts">
    <h1>Posts</h1>
    <a-button class="cards-create" @click="showAddPostModal"><PlusOutlined />Create new post</a-button>
    <div class="cards">
      <div class="cards-item" v-for="post in posts" :key="post.id">
        <div class="cards-item-title">
          <h3>{{ post.title }}</h3>
          <div class="cards-item-buttons">
            <a-button @click="editPost(post)"><EditOutlined /></a-button>
            <a-button @click="deletePost(post.id)"><DeleteOutlined /></a-button>
          </div>
        </div>
        <p>{{ post.body }}</p>
      </div>
    </div>
    <a-button class="cards-create" @click="showAddPostModal"><PlusOutlined />Create new post</a-button>
    <a-modal :footer="null" v-model:visible="addPostModalVisible">
      <template #default>
        <form class="cards-form" @submit.prevent="addOrSavePost">
          <a-form-item label="Title" :required="true">
            <a-input :value="newPostTitle" @update:value="newPostTitle = $event" />
          </a-form-item>
          <a-form-item label="Body" :required="true">
            <a-textarea :value="newPostBody" @update:value="newPostBody = $event" />
          </a-form-item>
          <a-button type="primary" html-type="submit">Save</a-button>
        </form>
      </template>
    </a-modal>

    <a-modal :footer="null" v-model:visible="editModalVisible">
      <template #default>
        <form class="cards-form" @submit.prevent="saveEditedPost">
          <a-form-item label="Title" :required="true">
            <a-input :value="formData.title" @update:value="formData.title = $event" id="editTitle" />
          </a-form-item>
          <a-form-item label="Body" :required="true">
            <a-textarea :value="formData.body" @update:value="formData.body = $event" id="editBody" />
          </a-form-item>
          <button type="submit">Save</button>
        </form>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted } from 'vue';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons-vue';
import Post from '@/models/Post';
import axios from 'axios';

export default defineComponent({
  components: {
    DeleteOutlined, EditOutlined, PlusOutlined
  },
  name: 'PostList',
  setup() {
    const posts: Ref<Post[]> = ref([]);
    const editModalVisible = ref(false);
    const formData = ref<Post>({ userId: 0, id: 0, title: '', body: '' });
    const addPostModalVisible = ref(false);
    const newPostTitle = ref('');
    const newPostBody = ref('');
    const loadingPosts = ref(true);

    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        posts.value = response.data;
      } catch (error) {
        console.error('Ошибка при загрузке списка постов:', error);
      } finally {
        loadingPosts.value = false;
      }
    };

    const deletePost = async (postId: number) => {
      try {
        await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        posts.value = posts.value.filter(post => post.id !== postId);
        console.log('Пост успешно удален');
      } catch (error) {
        console.error('Ошибка при удалении поста:', error);
      }
    };

    const editPost = (post: Post) => {
      formData.value = { ...post };
      editModalVisible.value = true;
    };

    const saveEditedPost = async () => {
      try {
        await axios.put(`https://jsonplaceholder.typicode.com/posts/${formData.value.id}`, formData.value);
        const index = posts.value.findIndex(post => post.id === formData.value.id);
        if (index !== -1) {
          posts.value[index] = { ...formData.value };
        }
        console.log('Пост успешно отредактирован');
        editModalVisible.value = false;
      } catch (error) {
        console.error('Ошибка при редактировании поста:', error);
      }
    };

    const addOrSavePost = async () => {
      try {
        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
          title: newPostTitle.value,
          body: newPostBody.value
        });

        const newPostData = response.data;
        const newPostObject = {
          id: newPostData.id,
          userId: newPostData.userId,
          title: newPostData.title,
          body: newPostData.body
        };

        posts.value.push(newPostObject);
        console.log('New post successfully added:', newPostObject);
        addPostModalVisible.value = false;
        newPostTitle.value = '';
        newPostBody.value = '';
      } catch (error) {
        console.error('Error adding new post:', error);
      }
    };


    const showAddPostModal = () => {
      addPostModalVisible.value = true;
    };

    onMounted(fetchPosts);

    return {
      posts,
      editModalVisible,
      formData,
      deletePost,
      editPost,
      saveEditedPost,
      addOrSavePost,
      showAddPostModal,
      addPostModalVisible,
      newPostTitle,
      newPostBody,
      loadingPosts
    };
  }
});
</script>

<style scooped>
.title {
  display: flex;
  align-items: baseline;
  justify-content: center;
  column-gap: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.cards-create {
  margin: 20px 0;
}

.cards-item {
  border: 1px solid #1890ff;
  padding: 4px 20px;
  background-color: #fafafa;
  text-align: left;
  border-radius: 12px;
}

.cards-item-title {
  display: flex;
  justify-content: space-between;
  column-gap: 20px;
  align-items: baseline;
}

.cards-item-buttons {
  display: flex;
  flex-direction: column;
  row-gap: 4px;
}

.cards-form {
  padding: 20px 20px 10px;
}
</style>