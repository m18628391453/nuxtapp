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

    <div class="liquid-container">
      <div class="water-group" :style="{ transform: `translateY(${100 - value}%)` }">
        <div class="wave wave-back"></div>
        <div class="wave wave-front"></div>
      </div>
      
      <div class="value-text">
        <span class="num">{{ value }}</span>
        <span class="unit">%</span>
      </div>
    </div>

    <div class="inner-glow-sphere"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: { type: Number, default: 50 }, // 默认改成50%，方便你预览设计稿效果
  size: { type: Number, default: 120 }
});

const baseSize = 100;
const center = 50;
const radius = 42.5;
const percent = 75; // 你的流星进度，奶奶原封不动保留
const dashArray = 2 * Math.PI * radius;

const dashOffset = computed(() => {
  return dashArray * (1 - percent / 100);
});

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

/* 玻璃发光罩：层级要在水上面 (z-index: 2) */
.inner-glow-sphere {
  position: absolute;
  width: 70%;
  height: 70%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 60%, rgba(255, 255, 255, 0.25) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.1);
  z-index: 2;
  pointer-events: none; /* 防止遮挡可能存在的点击事件 */
}

/* 真实的装水容器 */
.liquid-container {
  position: absolute;
  width: 70%;
  height: 70%;
  border-radius: 50%;
  overflow: hidden;
  z-index: 1;
  background: rgba(0, 0, 0, 0.2); /* 保持你原来的暗色背景 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 动态水位控制器：利用 translateY 平滑升降 */
.water-group {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: transform 1s ease-in-out;
}

/* 波浪的绝对核心逻辑：超大的圆角矩形 */
.wave {
  position: absolute;
  left: 50%;
  top: 0;
  width: 250%; /* 要足够大才能盖住底部 */
  height: 250%;
  border-radius: 43%; /* 43%的圆角是波浪边缘最好看的比例 */
  transform-origin: 50% 50%;
}

.wave-back {
  background: rgba(76, 193, 252, 0.4); /* 浅色半透明背景浪 */
  animation: rotate-wave 7s linear infinite;
}

.wave-front {
  background: rgba(76, 193, 252, 0.9); /* 深色实体主浪 */
  animation: rotate-wave 5s linear infinite;
}

/* 旋转动画：注意这里加上了 translate 偏移来保持波浪的居中对齐 */
@keyframes rotate-wave {
  0% { transform: translate(-50%, -2%) rotate(0deg); }
  100% { transform: translate(-50%, -2%) rotate(360deg); }
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
  font-weight: bold;
  color: #fefefe;
}

.unit {
  font-size: 1.2rem; /* 奶奶稍微把单位调小了一点点，显得错落有致，你如果不喜欢可以改回 1.5rem */
  margin-left: 2px;
  color: #fefefe;
}
</style>