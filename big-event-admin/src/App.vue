<script setup>
// 在 Vue3 CompositionAPI 中
// 1. 获取路由对象 router  useRouter
//    const router = useRouter()
// 2. 获取路由参数 route   useRoute
//    const route = useRoute()
import { useRoute, useRouter } from 'vue-router'
import { useUserStore, useCountStore } from '@/stores'
const router = useRouter()
const route = useRoute()

const goList = () => {
  router.push('/list')
  console.log(router, route)
}

const userStore = useUserStore()
const countStore = useCountStore()
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
