import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import { Button, Modal, Form, Input, Textarea, Spin } from 'ant-design-vue';

const app = createApp(App);
const pinia = createPinia();
app.use(Button);
app.use(Modal);
app.use(Form);
app.use(Input);
app.use(Textarea);
app.use(Spin);
app.use(pinia);
app.mount('#app');