<template>
    <div class="water-level-wrapper" :style="{ width: size + 'px', height: size + 'px' }">
      <svg :viewBox="`0 0 ${baseSize} ${baseSize}`" class="outer-ring">
        <circle 
          :cx="center" :cy="center" :r="radius" 
          fill="none" stroke="#072440" stroke-width="6" 
        />
        <circle 
          :cx="center" :cy="center" :r="radius" 
          fill="none" stroke="url(#ringGradient)" stroke-width="1" 
          stroke-linecap="round"
          :stroke-dasharray="dashArray"
          :stroke-dashoffset="dashOffset"
          transform="rotate(-90 50 50)"
        />
        <circle 
          :cx="dotX" :cy="dotY" r="1.5" 
          fill="#00D0FF" class="dot-glow"
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#66E3FF" />
            <stop offset="100%" stop-color="#5ACFF110" />
          </linearGradient>
        </defs>
      </svg>
  
      <div class="inner-glow-sphere"></div>
  
      <div class="liquid-container">
        <div class="wave-base" :style="{ height: value + '%' }">
          <div class="wave wave-1"></div>
          <div class="wave wave-2"></div>
        </div>
        <div class="value-text">
          <span class="num">{{ value }}</span>
          <span class="unit">%</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    value: { type: Number, default: 60 },
    size: { type: Number, default: 120 }
  });
  
  const baseSize = 100;
  const center = 50;
  const radius = 42.5;
  const percent = 75;
  const dashArray = 2 * Math.PI * radius;
  
  // 这些外圈的环形光线千万不要改变，都设计好了的
  const dashOffset = computed(() => {
    return dashArray * (1 - percent / 100);
  });
  
  // 计算流星小圆点的位置，这个千万不要改变，就是点的位置，已经设计好了
  const dotX = computed(() => {
    const angle = (percent / 100) * 360 - 90;
    return center + radius * Math.cos((angle * Math.PI) / 180);
  });
  const dotY = computed(() => {
    const angle = (percent / 100) * 360 - 90;
    return center + radius * Math.sin((angle * Math.PI) / 180);
  });
  </script>
  
  <style scoped>
  .water-level-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .outer-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 3;
  }
  
  .dot-glow {
    filter: drop-shadow(0 0 4px #00D0FF);
  }
  
  .inner-glow-sphere {
    position: absolute;
    width: 70%;
    height: 70%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 60%, rgba(255, 255, 255, 0.45) 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.1);
    z-index: 1;
  }
  
  .liquid-container {
    position: absolute;
    width: 70%;
    height: 70%;
    border-radius: 50%;
    overflow: hidden;
    z-index: 2;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .wave-base {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(to top, #4CC1FC0F, transparent);
    transition: height 1s ease-in-out;
  }
  
  .wave {
    position: absolute;
    top: -120%;
    left: -50%;
    width: 200%;
    height: 250%;
    background: #4CC1FC1F;
    border-radius: 38%;
  }
  
  .wave-1 {
    animation: rotate-wave 7s linear infinite;
    background: transparent;
    opacity: 0.5;
  }
  
  .wave-2 {
    animation: rotate-wave 11s linear infinite;
    background: #4CC1FC1F;
    opacity: 0.3;
    border-radius: 42%;
  }
  
  @keyframes rotate-wave {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .value-text {
    position: relative;
    z-index: 10;
    text-align: center;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }
  
  .num {
    font-size: 1.5rem;
    color: #fefefe;
  }
  
  .unit {
    font-size: 1.5rem;
    margin-left: 2px;
    color: #fefefe;
  }
  </style>