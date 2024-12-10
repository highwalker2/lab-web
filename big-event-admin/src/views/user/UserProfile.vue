<script setup>
import avatar from '@/assets/头像.png'
import { useUserStore } from '@/stores'
import { computed } from 'vue'

const userStore = useUserStore()

// 定义计算属性userTypeText
const userTypeText = computed(() => {
  const userTypeMap = {
    0: '导师',
    1: '博士生',
    2: '研究生',
    3: '本科生',
    4: '已就业'
  }
  // 根据用户存储中的用户类型获取对应的文本描述，如果不存在则返回未知类型
  return userTypeMap[userStore.user.type] || '未知类型'
})
const sex = computed(() => {
  const sexMap = { 1: '男', 2: '女' }
  return sexMap[userStore.user.sex] || '未知'
})
</script>

<template>
  <el-row>
    <el-col :span="4">
      <div class="grid-content">
        <div class="avatar">
          <img :src="userStore.user.avatar || avatar" alt="" />
        </div>
        <div class="message">
          <h1>{{ userStore.user.workPlace }}</h1>
          <h1>{{ userTypeText }}</h1>
          <h1>
            统一认证码:<span>{{ userStore.user.authenticationId }}</span>
          </h1>
          <h1>
            学号:<span>{{ userStore.user.studentId }}</span>
          </h1>
          <h1>
            手机号：<span>{{ userStore.user.phone }}</span>
          </h1>
          <h1>
            Email:<span>{{ userStore.user.email }}</span>
          </h1>
        </div>
      </div>
    </el-col>
    <el-col :span="20"
      ><div class="grid-content">
        <div>
          <h1 style="font-size: 30px">Qin YU</h1>
        </div>
        <div>
          <h2>基本信息</h2>
          <div style="justify-content: center">
            <table class="basemsg">
              <tr>
                <td>年龄</td>
                <td>性别:{{ sex }}</td>
              </tr>
              <tr>
                <td>出生日期</td>
                <td>籍贯</td>
              </tr>
              <tr>
                <td>年级</td>
                <td>专业名称</td>
              </tr>
              <tr>
                <td>类型</td>
                <td>职位</td>
              </tr>
              <tr>
                <td colspan="2">研究方向</td>
              </tr>
            </table>
          </div>
        </div>
        <hr />
        <div>
          <h2>个人简介</h2>
          <div>
            <span>详细内容</span>
          </div>
        </div>
        <hr />
        <div>
          <h2>教育经历</h2>
          <div style="justify-content: center">
            <table class="baseexp">
              <tr>
                <th>时间</th>
                <th>学校</th>
                <th>经历</th>
              </tr>
              <tr>
                <td>1</td>
                <td>1</td>
                <td>1</td>
              </tr>
            </table>
          </div>
        </div>
        <hr />
        <div>
          <h2>近期事宜</h2>
          <div>
            <span>详细内容</span>
          </div>
        </div>
        <hr />
        <div>
          <h2>个人荣誉</h2>
          <div>
            <table>
              <tr>
                <th>详细内容</th>
              </tr>
            </table>
          </div>
        </div>
        <hr />
        <div>
          <h2>座右铭</h2>
          <div>
            <span>详细内容</span>
          </div>
        </div>
      </div></el-col
    >
  </el-row>
</template>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
  border: 1px dashed black;
}
.el-col:first-child {
  background-color: white;
}
.avatar {
  width: 200px;
  height: 200px;
  margin: auto;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 使图片填充容器并保持比例 */
}
.message span {
  font-weight: normal;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.grid-content:first-child {
  text-align: center;
}
.basemsg {
  margin: auto;
  width: 600px;
  background-color: antiquewhite;
}
.baseexp {
  margin: auto;
  width: 1000px;
  background-color: antiquewhite;
}
</style>
