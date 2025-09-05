<template>
  <div class="ad-card">
    <div class="ad-image-container">
      <img 
        :src="ad.image" 
        :alt="ad.title"
        class="ad-image"
        @error="handleImageError"
      />
      <div v-if="ad.sponsored" class="sponsored-badge">
        赞助
      </div>
    </div>
    
    <div class="ad-content">
      <h3 class="ad-title">{{ ad.title }}</h3>
      <p class="ad-description">{{ ad.description }}</p>
      
      <div class="ad-footer">
        <a 
          :href="ad.link" 
          target="_blank"
          rel="noopener noreferrer"
          class="ad-link"
        >
          查看详情 →
        </a>
        <span class="ad-type">{{ ad.type }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface AdItem {
  id: number
  title: string
  description: string
  image: string
  link: string
  type: string
  sponsored?: boolean
}

const props = defineProps<{
  ad: AdItem
}>()

const imageError = ref(false)

const handleImageError = () => {
  imageError.value = true
}
</script>

<style scoped>
.ad-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.ad-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.ad-image-container {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.ad-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.ad-card:hover .ad-image {
  transform: scale(1.05);
}

.sponsored-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.ad-content {
  padding: 20px;
}

.ad-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.ad-description {
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ad-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ad-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: color 0.2s ease;
}

.ad-link:hover {
  color: #2563eb;
}

.ad-type {
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ad-image-container {
    height: 140px;
  }
  
  .ad-content {
    padding: 16px;
  }
  
  .ad-title {
    font-size: 16px;
  }
  
  .ad-description {
    font-size: 13px;
  }
}
</style>