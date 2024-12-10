<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import InputTable from '@/components/InputTable copy.vue'
import { paperGetService } from '../../api/paper'
import { CirclePlus, Search } from '@element-plus/icons-vue'

// 定义状态
const visible = ref(false) // 弹出框状态
const papers = ref([]) // 论文列表
const loading = ref(false) // 加载状态
const error = ref(null) // 错误信息
const page = ref(1) // 当前页码
const pageSize = ref(10) // 每页记录数
const total = ref(0) // 数据总数
const title = ref('') // 搜索框输入的内容

const fieldOptions = ref([
  { fieldValue: '', label: '全部' },
  { fieldValue: '0', label: '社交网络' },
  { fieldValue: '1', label: 'VLC' },
  { fieldValue: '2', label: '交通' }
])
const fieldValue = ref('') // 实时获取的领域类型

const typeOptions = ref([
  { typeValue: '', label: '全部' },
  { typeValue: '0', label: '发表论文' },
  { typeValue: '1', label: '必看论文' },
  { typeValue: '2', label: '推荐论文' }
])
const typeValue = ref('') // 实时获取的论文类型

const pickerOptions = ref({
  shortcuts: [
    {
      text: '最近一周',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.emit('pick', [start, end])
      }
    },
    {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.emit('pick', [start, end])
      }
    },
    {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.emit('pick', [start, end])
      }
    }
  ]
})
// 格式化时间戳的函数
const formatDate = (timestamp) => {
  if (timestamp === null) {
    return null
  }
  const date = new Date(timestamp)
  return date.toISOString().slice(0, 10).replace('T', ' ')
}
//传入时间格式化
// 日期格式化函数
const formatDateUP = (date) => {
  if (!date) return null // 处理 null 情况
  const pad = (num) => String(num).padStart(2, '0') // 辅助函数，补零
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`
}
const dateStrings = ref('') // 时间区域
const startTime = ref(null) // 查询的开始时间
const endTime = ref(null) // 查询的结束时间

// 定义方法
const fetchPapers = async () => {
  loading.value = true
  try {
    const response = await paperGetService({
      page: page.value, // 这里使用 .value 来获取值
      pageSize: pageSize.value, // 这里使用 .value 来获取值
      title: title.value, // 这里使用 .value 来获取值
      fieldValue: fieldValue.value, // 这里使用 .value 来获取值
      typeValue: typeValue.value, // 这里使用 .value 来获取值
      startTime: startTime.value || null, // 这里使用 .value 来获取值
      endTime: endTime.value || null // 这里使用 .value 来获取值
    })
    if (response.data.code === 1) {
      console.log(response)
      papers.value = response.data.data.records
      total.value = response.data.data.total
      // console.log('赋值后的papers：', papers.value)
    } else {
      error.value = '数据获取错误'
    }
  } catch (err) {
    error.value = '数据获取错误'
  } finally {
    loading.value = false
  }
}

// 截断摘要内容
const truncatedAbstract = (item) => {
  if (!item.abstractText) return ''
  return item.abstractText.length > 100
    ? item.abstractText.slice(0, 100)
    : item.abstractText
}

// 获取第几页数据
const handleCurrentChange = (val) => {
  page.value = val
  fetchPapers()
}

// 显示弹出框
const handleOpen = () => {
  console.log('显示弹出框')
  console.log(visible.value)
  visible.value = true
  console.log(visible.value)
}

// 登出
// const handleLogout = () => {
//   localStorage.removeItem('token')
//   this.$router.push('/login')
// }

// 登出提示
// const logout = () => {
//   this.$confirm('是否确认要退出登录?', '提示', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//     type: 'warning'
//   })
//     .then(() => {
//       handleLogout()
//       this.$message({ type: 'success', message: '退出成功!' })
//     })
//     .catch(() => {
//       this.$message({ type: 'info', message: '已取消登出！' })
//     })
// }

// 监听值变化
watch(dateStrings, (newVal) => {
  startTime.value = newVal.length > 0 ? formatDateUP(new Date(newVal[0])) : null
  endTime.value = newVal.length > 1 ? formatDateUP(new Date(newVal[1])) : null
  fetchPapers()
})
watch([fieldValue, typeValue], () => fetchPapers())

const searchByName = () => {
  fetchPapers()
}

// 加载数据
onMounted(fetchPapers)
</script>

<template>
  <div class="container">
    <div class="header">
      <h1 style="font-size: 30px">论文列表</h1>
      <div style="align-content: center">
        <el-input
          v-model="title"
          placeholder="请输入内容"
          style="width: 200px; align-content: center"
        ></el-input>
        <el-button @click="searchByName"
          ><template v-slot:icon>
            <el-icon><Search /></el-icon> </template
        ></el-button>
      </div>
      <div>
        <span style="align-content: center"><strong>领域：</strong></span>
        <el-select
          v-model="fieldValue"
          placeholder="论文领域"
          style="width: 200px; align-content: center"
        >
          <el-option
            v-for="item in fieldOptions"
            :key="item.fieldValue"
            :label="item.label"
            :value="item.fieldValue"
          >
          </el-option>
        </el-select>
      </div>
      <div>
        <span style="align-content: center"><strong>类型：</strong></span>
        <el-select
          v-model="typeValue"
          placeholder="论文类型"
          style="width: 200px; align-content: center"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.typeValue"
            :label="item.label"
            :value="item.typeValue"
          >
          </el-option>
        </el-select>
      </div>
      <div class="block">
        <span class="demonstration"></span>
        <el-date-picker
          v-model="dateStrings"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </div>
      <div style="align-content: center; height: 40px">
        <el-button type="primary" :prefix-icon="CirclePlus" @click="handleOpen"
          >添加</el-button
        >
      </div>
    </div>
    <div class="list-body">
      <div class="body" v-for="item in papers" :key="item.id">
        <div class="picture">
          <img src="@/assets/picture.jpg" alt="" />
        </div>
        <div class="content">
          <table width="100%" cellpadding="5px">
            <tr>
              <th colspan="4">{{ item.title }}</th>
            </tr>
            <tr>
              <td><strong>作者:</strong>{{ item.authorAll }}</td>
              <td colspan="3">
                <strong>发表时间:</strong>{{ formatDate(item.acceptanceTime) }}
              </td>
            </tr>
            <tr>
              <td><strong>引用数:</strong>{{ item.citedNumber }}</td>
              <td colspan="3"><strong>关键词:</strong>{{ item.keyword }}</td>
            </tr>
            <tr>
              <td rowspan="2" colspan="4">
                <strong>摘要: </strong>{{ truncatedAbstract(item) }}
                <span
                  >...
                  <router-link
                    :to="{ path: '/paperDetail', query: { id: item.id } }"
                    >查看详情</router-link
                  ></span
                >
              </td>
            </tr>
            <tr></tr>
          </table>
        </div>
      </div>
    </div>
    <div class="block">
      <span class="demonstration" v-if="papers == ''">查询结果为空...</span>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="prev, pager, next, total"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
  <input-table v-model="visible"></input-table>
</template>

<style scoped>
.container {
  width: 2300px;
  margin: 0 auto;
  overflow-x: auto; /* 水平方向出现滚动条 */
}
.header {
  display: flex;
  align-items: center;
  gap: 30px;
}
.list-body {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly; /* 确保元素在一行时有间距 */
}
.body {
  display: flex;
  width: 45%; /* 调整宽度为 35vw, 保证两列布局时不会超出100%宽度 */
  align-content: center;
  margin-bottom: 10px; /* 添加一些底部间距，确保换行后有间隔 */
  border: 2px solid rgb(136, 134, 134);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
table td {
  vertical-align: top;
}

.picture {
  height: 100%; /* 高度相对于视口高度 */
  width: 20%; /* 宽度相对于视口宽度 */
  align-content: center;
  /* background-color: aqua; */
}

.content {
  height: 100%; /* 高度相对于视口高度 */
  width: 100%; /* 宽度相对于视口宽度 */
  padding-top: 0.5vh;
  /* background-color: bisque; */
}
.block {
  display: flex;
  flex-direction: column; /* 使子元素在垂直方向上排列 */
  align-items: center;
}
</style>
