<template>
  <a-config-provider :locale="zhCN">
    <NuxtLayout :style="{ background: '#0B1B32' }">
      <NuxtPage />
    </NuxtLayout>
  </a-config-provider>
</template>

<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
</script>

<style>
body {
  margin: 0;
  background: #0B1B32;
}
</style>