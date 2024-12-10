<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const imgUrl = ref(userStore.user.user_pic)
const uploadRef = ref()
const selectedFile = ref(null) // 存储用户选择的文件

const onSelectFile = (uploadFile) => {
  selectedFile.value = uploadFile.raw // 存储上传文件的引用

  // 使用 FileReader 读取图片做预览
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
}

const onUpdateAvatar = async () => {
  // 检查是否有选中的文件
  if (!selectedFile.value) {
    ElMessage.error('请先选择图片')
    return
  }

  // 使用 FormData 包装文件，准备发送给后端
  const formData = new FormData()
  formData.append('file', selectedFile.value) // 将文件添加到 FormData 中

  // 发送请求更新头像
  try {
    await userUpdateAvatarService(formData)
    await userStore.getUser() // 重新获取用户信息以更新头像
    ElMessage.success('头像更新成功')
  } catch (error) {
    ElMessage.error('头像上传失败')
  }
}
</script>

<template>
  <page-container title="更换头像">
    <el-upload
      ref="uploadRef"
      :auto-upload="false"
      class="avatar-uploader"
      :show-file-list="false"
      :on-change="onSelectFile"
    >
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>

    <br />

    <el-button
      @click="uploadRef.$el.querySelector('input').click()"
      type="primary"
      :icon="Plus"
      size="large"
    >
      选择图片
    </el-button>
    <el-button
      @click="onUpdateAvatar"
      type="success"
      :icon="Upload"
      size="large"
    >
      上传头像
    </el-button>
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
