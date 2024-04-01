<template>
  <a-spin v-if="loadingPosts" />
  <div v-if="!loadingPosts">
    <h1>Posts</h1>
    <a-button class="cards-create" @click="showAddPostModal"><PlusOutlined />Create new post</a-button>
    <div class="cards">
      <div class="cards-item" v-for="post in visiblePosts" :key="post.id">
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
    <div class="cards-item-buttons">
      <a-button @click="showAddPostModal"><PlusOutlined />Create new post</a-button>
      <a-button v-if="shouldShowLoadMoreButton()" @click="loadMorePosts">Load More</a-button>
      <a-button @click="scrollToTop"><ArrowUpOutlined /> Scroll to Top</a-button>
    </div>
    <a-modal :footer="null" v-model:open="addPostModalVisible">
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

    <a-modal :footer="null" v-model:open="editModalVisible">
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

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { usePostStore } from '../store/store';
  import { DeleteOutlined, EditOutlined, PlusOutlined, ArrowUpOutlined } from '@ant-design/icons-vue';
  import Post from '@/models/Post';

  // Инициализация хранилища постов и реактивных переменных для модальных окон и данных формы
  const postStore = usePostStore();
  const newPostTitle = ref('');
  const newPostBody = ref('');
  const addPostModalVisible = ref(false);
  const editModalVisible = ref(false);
  const formData = ref<Post>({ userId: 0, id: 0, title: '', body: '' });
  const loadedPostCount = ref(12);
  const displayedPostCount = ref(0);

  // Вычисляемые свойства для управления состоянием загрузки и списка постов
  const loadingPosts = computed(() => postStore.loadingPosts);
  const posts = computed(() => postStore.posts);
  const visiblePosts = computed(() => posts.value.slice(0, 12));

  // Функции для управления модальными окнами и операциями с постами
  const showAddPostModal = () => {
    addPostModalVisible.value = true;
  };

  const addOrSavePost = async () => {
    await postStore.createPost({ title: newPostTitle.value, body: newPostBody.value, id: 0, userId: 0 });
    addPostModalVisible.value = false;
    newPostTitle.value = '';
    newPostBody.value = '';
  };

  const editPost = (post: Post) => {
    formData.value = { ...post };
    editModalVisible.value = true;
  };

  const saveEditedPost = async () => {
    await postStore.updatePost(formData.value);
    editModalVisible.value = false;
  };

  const deletePost = (postId: number) => {
    postStore.deletePost(postId);
  };

  // Функция для определения, нужно ли показывать кнопку "Загрузить больше"
  const shouldShowLoadMoreButton = () => {
    return displayedPostCount.value < posts.value.length;
  };

  // Функция для загрузки дополнительных постов
  const loadMorePosts = () => {
    const startIndex = displayedPostCount.value;
    const endIndex = Math.min(startIndex + loadedPostCount.value, posts.value.length);
    for (let i = startIndex; i < endIndex; i++) {
      visiblePosts.value.push(posts.value[i]);
    }
    displayedPostCount.value = endIndex;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Прокрутка к верху с плавным эффектом
  };

  onMounted(() => {
    postStore.fetchPosts();
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
  padding-bottom: 20px;
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