<template>
  <div class="plan-card border border-gray-200 rounded-lg p-6" :class="{ 'highlight': plan.isRecommended }">
    <div class="text-center mb-4">
      <h3 class="font-bold text-xl text-gray-800">{{ plan.name }}</h3>
      <div class="mt-2">
        <span class="text-3xl font-bold text-indigo-600">¥{{ plan.price }}</span>
        <span class="text-gray-500">/{{ plan.period }}</span>
      </div>
      <p class="text-sm text-gray-500 mt-1">{{ plan.saveTip }}</p>
    </div>
    <ul class="space-y-2 mb-6">
      <li v-for="(benefit, idx) in plan.benefits" :key="idx" class="flex items-start">
        <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
        <span class="text-sm text-gray-600">{{ benefit }}</span>
      </li>
    </ul>
    <button class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition" @click="selectPlan">
      选择此套餐
    </button>
  </div>
</template>

<script>
export default {
  name: 'VipPlanCard',
  props: ['plan'],
  emits: ['select-plan'],
  methods: {
    selectPlan() {
      this.$emit('select-plan', this.plan.id);
    }
  }
}
</script>

<style scoped>
.plan-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(118, 75, 162, 0.15);
}
.plan-card.highlight {
  border-color: #764ba2;
  position: relative;
  transform: scale(1.02);
}
.plan-card.highlight::before {
  content: "最受欢迎";
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #764ba2;
  color: white;
  padding: 2px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}
</style>