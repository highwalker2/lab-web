<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { userCountService } from '../../api/user'

// 引用图表实例
const myChart = ref(null)

// 初始化数据为 null，用于存储后端返回的数据
const chartData = ref({
  mentor: 0,
  doctor: 0,
  postgraduate: 0,
  undergraduate: 0,
  employee: 0
})

// 获取数据并更新图表
const fetchDataAndRenderChart = async () => {
  try {
    const response = await userCountService() // 修改为你的真实 API 路径
    chartData.value = response.data.data

    // 将后端数据转换为 ECharts 饼图格式
    const pieData = [
      { value: chartData.value.mentor, name: '导师' },
      { value: chartData.value.doctor, name: '博士生' },
      { value: chartData.value.postgraduate, name: '研究生' },
      { value: chartData.value.undergraduate, name: '本科生' },
      { value: chartData.value.employee, name: '已就业' }
    ]

    // 设置 ECharts 配置项
    const option = {
      title: {
        text: '用户分布',
        subtext: '模拟假数据',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '用户类别',
          type: 'pie',
          radius: '50%',
          data: pieData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }

    // 更新图表数据
    myChart.value.setOption(option)
  } catch (error) {
    console.error('数据获取失败:', error)
  }
}

onMounted(() => {
  // 初始化 ECharts 图表
  const chartDom = document.getElementById('main')
  myChart.value = echarts.init(chartDom)
  fetchDataAndRenderChart() // 调用获取数据并渲染图表
})
</script>

<template>
  <div>
    <h2>成员管理</h2>
    <!-- 图表容器 -->
    <div id="main" style="width: 600px; height: 400px"></div>
  </div>
</template>

<style scoped>
#main {
  width: 600px;
  height: 400px;
  border: 1px solid rgb(155, 198, 238);
}
</style>
