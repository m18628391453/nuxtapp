// plugins/antd.ts
import { DatePicker, Select } from 'ant-design-vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(DatePicker);
  nuxtApp.vueApp.use(Select);
});