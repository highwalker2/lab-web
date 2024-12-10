<template>
  <div>
    <div>
      <button @click="goBack">返回上一页</button>
    </div>
    <div class="paper-display">
      <!-- 论文标题 -->
      <h1>{{ paper.title }}</h1>
      <!-- 论文信息卡片 -->
      <el-card class="paper-card" shadow="hover">
        <!-- 论文图片 -->
        <img src="@/assets/picture.jpg" alt="论文封面" class="paper-cover" />
        <!-- 论文信息 -->
        <div class="paper-info">
          <p><strong>作者：</strong>{{ paper.authorAll }}</p>
          <p><strong>关键词：</strong>{{ paper.keyword }}</p>
          <p><strong>领域：</strong>{{ paper.field }}</p>
          <p><strong>类型：</strong>{{ paper.type }}</p>
          <p><strong>期刊名称：</strong>{{ paper.publishName }}</p>
          <p><strong>引用次数：</strong>{{ paper.citedNumber }}</p>
          <p><strong>提交时间：</strong>{{ formatDate(paper.submitTime) }}</p>
          <p>
            <strong>接受时间：</strong>{{ formatDate(paper.acceptanceTime) }}
          </p>
        </div>
        <!-- 论文摘要 -->
        <el-divider>摘要</el-divider>
        <p class="paper-abstract">{{ paper.abstractText }}</p>
        <!-- 下载链接 -->
        <div class="button-row">
          <a
            v-if="paper.downloadLink"
            :href="paper.downloadLink"
            download
            target="_blank"
          >
            <el-button type="primary" icon="el-icon-download" round
              >下载论文</el-button
            >
          </a>
          <el-button
            type="success"
            icon="el-icon-scissors"
            round
            @click="showUpdate"
            >编辑论文</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            round
            @click="deletePaper"
            >删除论文</el-button
          >
        </div>
      </el-card>
    </div>
    <update-table v-model="isShow"></update-table>
  </div>
</template>

<script>
import axios from 'axios'
import { paperDelete, paperDetailService } from '../../api/paper'
// import router from '../../router'
import UpdateTable from '@/components/UpdateTable.vue'
import { ElMessageBox } from 'element-plus'

export default {
  components: { UpdateTable },
  data() {
    return {
      isShow: false, //编辑表单的属性
      paper: {}, // 用于存储请求返回的数据
      error: null
    }
  },
  created() {
    // 在组件加载时获取数据
    this.fetchPaperDetails()
  },
  methods: {
    async fetchPaperDetails() {
      // 获取URL中的查询参数 id
      const id = this.$route.query.id

      // 检查 id 是否存在
      if (!id) {
        this.error = '缺少参数 id'
        return
      }
      console.log(id)
      console.log(this.error)

      try {
        // 发送请求到后端
        console.log(id)
        const response = await paperDetailService({ id })
        if (response.data.code === 1) {
          // 成功获取数据
          this.paper = response.data.data
        } else {
          this.error = '数据获取失败'
        }
      } catch (error) {
        this.error = '请求失败，请检查网络'
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    // create() {
    //   Bus.$on('getPaperId', (msg) => {
    //     console.log(msg)
    //     this.paperId = msg
    //   })
    // },
    formatDate(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleDateString()
    },
    //设置论文编辑页面的可视化
    showUpdate() {
      this.isShow = true
    },
    //删除论文
    deletePaper() {
      ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const id = this.$route.query.id
          this.deleteY(id)
          this.goBack()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //删除确认
    async deleteY(id) {
      try {
        // 发送请求到后端
        const response = await paperDelete({ id })
        if (response.data.code === 1) {
          // 成功获取数据
          this.paper = response.data.data
        } else {
          this.error = '论文删除失败失败'
        }
      } catch (error) {
        this.error = '请求失败，请检查网络'
      }
    }
  }
}
</script>

<style>
.paper-display {
  max-width: 800px;
  margin: 0 auto;
}
.paper-display h1 {
  text-align: center;
}
.paper-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.paper-cover {
  width: 150px;
  height: 200px;
  margin-bottom: 20px;
}
.paper-info {
  margin-bottom: 20px;
  width: 100%;
}
.paper-abstract {
  margin: 10px 0;
  /* white-space: pre-wrap; */
  text-indent: 2em;
}
a.no-underline {
  text-decoration: none; /* 移除下划线 */
}
.button-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.button-row a {
  display: inline-flex;
  align-items: center;
}
</style>
