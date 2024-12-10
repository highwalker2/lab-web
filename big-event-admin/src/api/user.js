import request from '@/utils/request'

//登录接口
export const userLoginService = ({ studentId, password, uuid, code, isVery }) =>
  request.post('/user/login', { studentId, password, uuid, code, isVery })

// 注册接口
export const userRegisterService = ({
  studentId,
  password,
  repassword,
  uuid,
  code
}) => request.post('/user/reg', { studentId, password, repassword, uuid, code })

//验证码获取接口
export const getCodeService = () => request.get('/user/getCode')

// 获取用户基本信息
export const userGetInfoService = () => request.get('/user/userinfo')

// 更新用户基本信息
export const userUpdateInfoService = (form) =>
  request.put('/user/infoUpdate', form)

// 更新用户密码
export const userUpdatePasswordService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/user/updatepwd', { old_pwd, new_pwd, re_pwd })

// 更新用户头像
export const userUpdateAvatarService = (avatar) =>
  request.patch('/user/update/avatar', avatar)

//统计当前成员类型数量
export const userCountService = () => request.get('/user/statistics')
