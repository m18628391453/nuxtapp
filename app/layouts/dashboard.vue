<template>
    <div class="relative min-h-screen text-white font-sans" 
        :style="{ 
        backgroundImage: `url('/image/background.png')`, 
        backgroundSize: 'auto',  
        backgroundPosition: 'center -120px',
        backgroundRepeat: 'repeat-y',
        opacity: 0.99 
    }"
    >
        <div class="relative z-10 flex flex-col min-h-screen">
            <Header @settings="showSettings = true" />
            
            <div class="flex flex-1 overflow-hidden">
                <main class="flex-1 h-[calc(100vh-56px)] overflow-hidden">
                    <slot />
                </main>
            </div>
        </div>

        <SettingSidebar v-model:visible="showSettings" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
// 注意：如果你的组件不在同一个文件夹，记得改一下这里的相对路径哦！
import Header from '../components/Header.vue' 
import SettingSidebar from '../components/SettingSidebar.vue'
// 控制边侧栏是否显示的开关
const showSettings = ref(false)
</script>