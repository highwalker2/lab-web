<script lang="ts" setup>
import {
  userRegisterService,
  userLoginService,
  getCodeService
} from '@/api/user.js'
import { User, Lock, CircleCheck, View } from '@element-plus/icons-vue'
import { ref, watch, onMounted, nextTick } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import CaptchaVerification from '../../components/CaptchaVerification.vue'

const isRegister = ref(false)
const form = ref()
const codeUrl = ref('')
const codeRt = ref()
const loginN = ref(0) //登录次数判断
const dialogVisible = ref(false) //对话框隐藏与否属性
const robotConfir = ref(false) //人机验证是否成功

// 整个的用于提交的form数据对象
const formModel = ref({
  studentId: '',
  password: '',
  repassword: '',
  uuid: '',
  code: '',
  isVery: false //登录时，是否需要验证
})
// 整个表单的校验规则
// 1. 非空校验 required: true      message消息提示，  trigger触发校验的时机 blur change
// 2. 长度校验 min:xx, max: xx
// 3. 正则校验 pattern: 正则规则    \S 非空字符
// 4. 自定义校验 => 自己写逻辑校验 (校验函数)
//    validator: (rule, value, callback)
//    (1) rule  当前校验规则相关的信息
//    (2) value 所校验的表单元素目前的表单值
//    (3) callback 无论成功还是失败，都需要 callback 回调
//        - callback() 校验成功
//        - callback(new Error(错误信息)) 校验失败
const rules = ref({
  studentId: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是 5-10位 的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        // 判断 value 和 当前 form 中收集的 password 是否一致
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback() // 就算校验成功，也需要callback
        }
      },
      trigger: 'blur'
    }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'submit' },
    { min: 5, max: 5, message: '验证码必须是5位字符', trigger: 'submit' }
  ]
})

// 动态禁用校验规则
const disableCodeValidation = () => {
  console.log('动态禁用校验规则')
  console.log('前：', rules.value.code)
  rules.value.code = []
  form.value.clearValidate()
  console.log('后：', rules.value.code)
}

// 动态恢复校验规则
const enableCodeValidation = () => {
  console.log('动态恢复校验规则')
  rules.value.code = [
    { required: true, message: '请输入验证码', trigger: 'submit' },
    { min: 5, max: 5, message: '验证码必须是5位字符', trigger: 'submit' }
  ]
  form.value.clearValidate()
}

const register = async () => {
  // 注册成功之前，先进行校验，校验成功 → 请求，校验失败 → 自动提示
  await form.value.validate()
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功')
  isRegister.value = false
}

const userStore = useUserStore()
const router = useRouter()
const login = () => {
  dialogVisible.value = true
  loginN.value += 1
  if (robotConfir.value) {
    dialogVisible.value = false
    ElMessage.success('已完成人机校验！')
    getValue()
  } else {
    ElMessage.error('请继续完成人机校验！')
  }
  // console.log('此时robotCon的值为：', robotConfir.value)
  // if (robotConfir.value) {
  //   console.log('此时的值为：', loginN.value)
  //   await form.value.validate()
  //   const res = await userLoginService(formModel.value)
  //   userStore.setToken(res.data.data.token)
  //   ElMessage.success('登录成功')
  //   router.push('/article/manage')
  // } else {
  //   ElMessage.error('人机校验失败')
  // }
}

const getCode = async () => {
  if (!form.value) {
    console.error('Form is not initialized yet.')
    return
  }
  const res = await getCodeService()
  console.log(res)
  codeUrl.value = 'data:image/gif;base64,' + res.data.data.img
  formModel.value.uuid = res.data.data.uuid
  codeRt.value = res.data.data.code
}

onMounted(async () => {
  await nextTick() // 等待 DOM 更新
  await getCode() // 调用 getCode 以发送请求
}),
  // 切换的时候，重置表单内容
  watch(isRegister, () => {
    getCode()
    formModel.value = {
      studentId: '',
      password: '',
      repassword: ''
    }
  })

// 切换的时候，重置表单内容
watch(loginN, () => {
  console.log('此时的值为：', loginN.value)
  if (loginN.value >= 5) {
    formModel.value.isVery = true
  }
})

//设置长按密码可见功能
const showPassword = ref(false)
let timeoutId = null

const startShowPassword = () => {
  showPassword.value = true // 显示密码
  // 设置定时器，保持状态
  timeoutId = setTimeout(() => {
    showPassword.value = true // 持续显示密码
  }, 500) // 500ms 之后保持显示状态
}

const stopShowPassword = () => {
  clearTimeout(timeoutId) // 清除定时器
  showPassword.value = false // 隐藏密码
}

//设置人机验证对话框
const handleClose = (done) => {
  ElMessageBox.confirm('确定放弃人机验证吗？')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const getValue = async (msg) => {
  robotConfir.value = true
  console.log('此时robotCon的值为：', robotConfir.value)
  if (robotConfir.value) {
    console.log('此时的值为：', loginN.value)
    await form.value.validate()
    const res = await userLoginService(formModel.value)
    userStore.setToken(res.data.data.token)
    console.log('此时的token为:', userStore.token)
    ElMessage.success('登录成功')
    router.push('/article/manage')
  } else {
    ElMessage.error('人机校验失败')
  }
  console.log(msg)
}
</script>

<template>
  <!-- 
    1. 结构相关
      el-row表示一行，一行分成24份 
       el-col表示列  
       (1) :span="12"  代表在一行中，占12份 (50%)
       (2) :span="6"   表示在一行中，占6份  (25%)
       (3) :offset="3" 代表在一行中，左侧margin份数

       el-form 整个表单组件
       el-form-item 表单的一行 （一个表单域）
       el-input 表单元素（输入框）
    2. 校验相关
       (1) el-form => :model="ruleForm"      绑定的整个form的数据对象 { xxx, xxx, xxx }
       (2) el-form => :rules="rules"         绑定的整个rules规则对象  { xxx, xxx, xxx }
       (3) 表单元素 => v-model="ruleForm.xxx" 给表单元素，绑定form的子属性
       (4) el-form-item => prop配置生效的是哪个校验规则 (和rules中的字段要对应)
  -->
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册相关表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="studentId">
          <el-input
            v-model="formModel.studentId"
            :prefix-icon="User"
            placeholder="请输入学号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            :type="showPassword ? 'text' : 'password'"
          >
            <template #suffix>
              <el-icon
                @mousedown="startShowPassword"
                @mouseup="stopShowPassword"
                @mouseleave="stopShowPassword"
                style="cursor: pointer"
              >
                <View />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <div class="flex">
          <el-form-item prop="code" style="width: 260px">
            <el-input
              v-model="formModel.code"
              name="code"
              :prefix-icon="CircleCheck"
              placeholder="请输入验证码"
            ></el-input>
          </el-form-item>
          <div class="w-18px" />
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img" />
          </div>
        </div>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录相关表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="studentId">
          <el-input
            v-model="formModel.studentId"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
          >
            <template #suffix>
              <el-icon
                @mousedown="startShowPassword"
                @mouseup="stopShowPassword"
                @mouseleave="stopShowPassword"
                style="cursor: pointer"
              >
                <View />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <div class="flex" v-if="formModel.isVery">
          <el-form-item prop="code" style="width: 260px">
            <el-input
              v-model="formModel.code"
              name="code"
              :prefix-icon="CircleCheck"
              placeholder="请输入验证码"
              @focus="disableCodeValidation"
              @blur="enableCodeValidation"
            ></el-input>
          </el-form-item>
          <div class="w-18px" />
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img" />
          </div>
        </div>

        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
    <el-dialog
      v-model="dialogVisible"
      title="请进行人机验证"
      width="500"
      :before-close="handleClose"
    >
      <div>
        <CaptchaVerification @get-value="getValue"></CaptchaVerification>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;
}

.w-18px {
  width: 18px;
}

.login-code-img {
  height: 38px;
}
</style>
