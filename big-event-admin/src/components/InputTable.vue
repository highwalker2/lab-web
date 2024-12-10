<script setup>
import { ref, defineModel } from 'vue'
import { ElMessage } from 'element-plus'
import { paperAdd } from '../api/paper'
import { nextTick } from 'vue'

const modelValue = defineModel()
const fileList = ref([])
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

// 关闭弹框
const handleCancel = () => {
  console.log('开始上传', fileList.value)
  modelValue.value = false
  // fileList.value = []
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

const upload = ref(null)
// 提交按钮
const handleSubmit = async () => {
  await nextTick()
  // 先对PDF文件进行提交，再触发文件成功后的其他事件
  console.log('提交时的文件列表:', fileList.value)
  if (fileList.value.length !== 0) {
    upload.value.submit()
  } else {
    ElMessage.error('请上传论文文件')
  }
}

const beforeUpload = (file) => {
  // 文件校验逻辑
  if (file.type !== 'application/pdf') {
    ElMessage.error('只能上传 PDF 文件！')
    return false
  }
  if (file.size / 1024 / 1024 > 10) {
    ElMessage.error('上传文件大小不能超过 10MB!')
    return false
  }

  // 如果已有文件，清空列表再上传新文件
  if (fileList.value.length > 1) {
    ElMessage.warning('只能上传一个文件！')
  }
  return true
}
const handleChange = (file, fileList) => {
  console.log('文件被移除:', file)
  console.log('剩余文件列表:', fileList)
  // 更新响应式文件列表
  fileList.value = [...fileList]

  console.log('响应式文件列表已更新:', fileList.value)
  // fileList.value = fileList.slice(-1) // 只保留最新的文件
  nextTick(() => {
    // fileList.value = fileList.slice(-1)
    console.log('更新后的文件列表:', fileList.value)
  })
}

// 上传文件成功后，再对表单进行提交，保证表单可以获取到论文的下载链接
const handleSuccess = async (response) => {
  ElMessage.success('文件上传成功！')
  console.log('文件上传成功！')
  form.value.downloadLink = response.data
  console.log('文件存储地址:', response.data)
  try {
    // 构建请求参数
    // const token = localStorage.getItem('token')
    // const response = await axios.post('/paper/addPaper', form.value, {
    //   headers: {
    //     token: `${token}` // 使用 Bearer 令牌模式，或者根据后端要求调整
    //   }
    // })
    console.log('addPaper返回的值,此时为空')
    const response = await paperAdd(form.value)
    console.log('addPaper返回的值：', response)
    if (response.data.code === 1) {
      console.log(response)
      // 关闭弹框
      handleCancel()
      // 清空表单数据
      clearForm()
      // fileList.value = []
    } else {
      ElMessage.error('数据获取错误')
    }
  } catch (error) {
    console.log('报错的信息为：', error)
    ElMessage.error('数据获取错误')
  }
}

const handleError = () => {
  ElMessage.error('文件上传失败！')
}

const forceUpdate = () => {
  // 获取当前组件实例
  console.log('为什么输入不了啊？')
  console.log('name的值为：', form.value.name)
}
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
          <el-input v-model="form.name" @input="forceUpdate" />
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="form.keyword" @input="forceUpdate" />
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
        <el-form-item label="论文上传">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            action="http://localhost:8080/paper/upload"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :on-error="handleError"
            :limit="1"
            accept=".pdf"
            :file-list="fileList.value"
            @change="handleChange"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">只能上传PDF文件，且不超过10MB</div>
            </template>
          </el-upload>
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
