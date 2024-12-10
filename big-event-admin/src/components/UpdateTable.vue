<script setup>
import { ref, defineModel, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { paperUpdate } from '../api/paper'
import { paperDetailService } from '@/api/paper'
import { useRoute } from 'vue-router'

const route = useRoute()

const modelValue = defineModel()
const fieldOptions = ref([
  {
    fieldValue: '0',
    label: '社交网络'
  },
  {
    fieldValue: '1',
    label: 'VLC'
  },
  {
    fieldValue: '2',
    label: '交通'
  }
])
const typeOptions = ref([
  {
    typeValue: '0',
    label: '发表论文'
  },
  {
    typeValue: '1',
    label: '必看论文'
  },
  {
    typeValue: '2',
    label: '推荐论文'
  }
])

// 初始化form对象，确保在开始时有一个有效的表单数据
const form = ref({
  name: '',
  keyword: '',
  abstractText: '',
  authorAll: '',
  publishName: '',
  submitTime: '',
  acceptanceTime: '',
  fieldValue: '',
  typeValue: '',
  num: 0,
  urlLink: '',
  downloadLink: ''
})

const fetchPapers = async () => {
  // 获取URL中的查询参数 id
  const id = route.query.id
  try {
    // 发送请求到后端
    console.log(id)
    const response = await paperDetailService({ id })
    if (response.data.code === 1) {
      // 成功获取数据
      form.value = response.data.data
    } else {
      ElMessage.error('数据获取失败')
    }
  } catch (error) {
    ElMessage.error('请求失败，请检查网络')
  }
}

// 关闭弹框
const handleCancel = () => {
  modelValue.value = false
  clearForm()
}

// 弹框关闭的回调
const handleClose = () => {
  handleCancel()
}

// 清空form表单
const clearForm = () => {
  form.value.name = ''
  form.value.keyword = ''
  form.value.abstractText = ''
  form.value.authorAll = ''
  form.value.publishName = ''
  form.value.submitTime = ''
  form.value.acceptanceTime = ''
  form.value.fieldValue = ''
  form.value.typeValue = ''
  form.value.num = 0
  form.value.urlLink = ''
  form.value.downloadLink = ''
}

// 提交按钮
const handleSubmit = async () => {
  try {
    // 构建请求参数
    console.log('addPaper返回的值,此时为空')
    const response = await paperUpdate(form.value)
    console.log('addPaper返回的值：', response)
    if (response.data.code === 1) {
      console.log(response)
      // 关闭弹框
      handleCancel()
      // 清空表单数据
      clearForm()
    } else {
      ElMessage.error('数据获取错误')
    }
  } catch (error) {
    console.log('报错的信息为：', error)
    ElMessage.error('数据获取错误')
  }
}

// const forceUpdate = () => {
//   // 获取当前组件实例
//   console.log('为什么输入不了啊？')
//   console.log('name的值为：', form.value.name)
// }
// const handleExceed = () => {
//   ElMessage.warning('只能上传一个文件！')
// }

// watch(
//   () => modelValue,
//   (newVal) => {
//     modelValue.value = newVal
//     console.log('modelValue changed:', newVal)
//   }
// )
onMounted(fetchPapers)
</script>

<template>
  <div>
    <el-dialog
      title="论文添加"
      v-model="modelValue"
      width="900px"
      @close="handleClose"
    >
      <!-- 使用v-if确保form被正确初始化 -->
      <el-form :model="form" label-width="80px">
        <el-form-item label="论文名称">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="form.keyword" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="form.abstractText"></el-input>
        </el-form-item>
        <el-form-item label="论文作者">
          <el-input v-model="form.authorAll"></el-input>
        </el-form-item>
        <el-form-item label="发表期刊">
          <el-input v-model="form.publishName"></el-input>
        </el-form-item>
        <el-form-item label="论文原链接">
          <el-input v-model="form.urlLink"></el-input>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.submitTime"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="发表时间">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.acceptanceTime"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="研究邻域">
          <el-select v-model="form.fieldValue" placeholder="请选择">
            <el-option
              v-for="item in fieldOptions"
              :key="item.fieldValue"
              :label="item.label"
              :value="item.fieldValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="论文类型">
          <el-select v-model="form.typeValue" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.typeValue"
              :label="item.label"
              :value="item.typeValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="引用次数">
          <el-input-number
            v-model="form.num"
            :min="0"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 在这里添加你的样式 */
</style>
