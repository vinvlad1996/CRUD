<template>
  <!-- Отображение индикатора загрузки, пока данные загружаются -->
  <a-spin v-if="loadingPosts" />
  <div v-if="!loadingPosts">
    <!-- Заголовок страницы -->
    <h1>Posts</h1>
    <!-- Кнопка для открытия модального окна добавления нового поста -->
    <a-button class="cards-create" @click="showAddPostModal"><PlusOutlined />Create new post</a-button>
    <!-- Контейнер для отображения списка постов -->
    <div class="cards">
      <!-- Итерация по массиву постов и отображение каждого поста -->
      <div class="cards-item" v-for="post in posts" :key="post.id">
        <!-- Заголовок и кнопки действий для каждого поста -->
        <div class="cards-item-title">
          <h3>{{ post.title }}</h3>
          <!-- Кнопки редактирования и удаления поста -->
          <div class="cards-item-buttons">
            <a-button @click="editPost(post)"><EditOutlined /></a-button>
            <a-button @click="deletePost(post.id)"><DeleteOutlined /></a-button>
          </div>
        </div>
        <!-- Текст поста -->
        <p>{{ post.body }}</p>
      </div>
    </div>
    <!-- Кнопка для открытия модального окна добавления нового поста (дублирующая) -->
    <a-button class="cards-create" @click="showAddPostModal"><PlusOutlined />Create new post</a-button>
    <!-- Модальное окно для добавления нового поста -->
    <a-modal :footer="null" v-model:visible="addPostModalVisible">
      <template #default>
        <!-- Форма для добавления нового поста -->
        <form class="cards-form" @submit.prevent="addOrSavePost">
          <!-- Поле для ввода заголовка -->
          <a-form-item label="Title" :required="true">
            <a-input :value="newPostTitle" @update:value="newPostTitle = $event" />
          </a-form-item>
          <!-- Поле для ввода текста поста -->
          <a-form-item label="Body" :required="true">
            <a-textarea :value="newPostBody" @update:value="newPostBody = $event" />
          </a-form-item>
          <!-- Кнопка для сохранения нового поста -->
          <a-button type="primary" html-type="submit">Save</a-button>
        </form>
      </template>
    </a-modal>

    <!-- Модальное окно для редактирования существующего поста -->
    <a-modal :footer="null" v-model:visible="editModalVisible">
      <template #default>
        <!-- Форма для редактирования существующего поста -->
        <form class="cards-form" @submit.prevent="saveEditedPost">
          <!-- Поле для редактирования заголовка -->
          <a-form-item label="Title" :required="true">
            <a-input :value="formData.title" @update:value="formData.title = $event" id="editTitle" />
          </a-form-item>
          <!-- Поле для редактирования текста поста -->
          <a-form-item label="Body" :required="true">
            <a-textarea :value="formData.body" @update:value="formData.body = $event" id="editBody" />
          </a-form-item>
          <!-- Кнопка для сохранения отредактированного поста -->
          <button type="submit">Save</button>
        </form>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted } from 'vue';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons-vue';
import Post from '@/models/Post'; // Подключение модели поста
import axios from 'axios'; // Подключение Axios для выполнения HTTP-запросов

export default defineComponent({
  components: {
    DeleteOutlined, EditOutlined, PlusOutlined // Подключение иконок из Ant Design
  },
  name: 'PostList', // Имя компонента
  setup() {
    // Инициализация переменных состояния
    const posts: Ref<Post[]> = ref([]); // Массив постов
    const editModalVisible = ref(false); // Флаг видимости модального окна редактирования
    const formData = ref<Post>({ userId: 0, id: 0, title: '', body: '' }); // Данные формы редактирования
    const addPostModalVisible = ref(false); // Флаг видимости модального окна добавления
    const newPostTitle = ref(''); // Новый заголовок поста
    const newPostBody = ref(''); // Новый текст поста
    const loadingPosts = ref(true); // Флаг загрузки постов

    // Функция для загрузки списка постов
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

    // Функция для удаления поста
    const deletePost = async (postId: number) => {
      try {
        await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        posts.value = posts.value.filter(post => post.id !== postId);
        console.log('Пост успешно удален');
      } catch (error) {
        console.error('Ошибка при удалении поста:', error);
      }
    };

    // Функция для открытия модального окна редактирования
    const editPost = (post: Post) => {
      formData.value = { ...post };
      editModalVisible.value = true;
    };

    // Функция для сохранения отредактированного поста
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

    // Функция для добавления или сохранения нового поста
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

    // Функция для отображения модального окна добавления нового поста
    const showAddPostModal = () => {
      addPostModalVisible.value = true;
    };

    // Загрузка списка постов при монтировании компонента
    onMounted(fetchPosts);

    // Возврат переменных и функций для использования в шаблоне
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