import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import { Button, Modal, Form, Input, Spin, notification } from 'ant-design-vue';
const { TextArea } = Input;

const app = createApp(App);
const pinia = createPinia();
app.use(Button);
app.use(Modal);
app.use(Form);
app.use(Spin);
app.use(pinia);
app.component('AInput', Input);
app.component('ATextarea', TextArea);

app.config.globalProperties.$notification = notification;

app.mount('#app');