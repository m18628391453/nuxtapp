<template>
  <NuxtLayout 
      :style="{ 
          backgroundImage: `url('/image/background.png')`, 
          backgroundSize: 'auto',  
          backgroundPosition: 'center -120px',
          backgroundRepeat: 'repeat-y',
          opacity: 0.99 
      }"
  >
    <NuxtPage />
  </NuxtLayout>
</template>