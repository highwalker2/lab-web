import request from '@/utils/request'

//获取论文列表
export const paperGetService = ({
  page,
  pageSize,
  title,
  fieldValue,
  typeValue,
  startTime,
  endTime
}) => {
  return request.get('/paper/paperQuery', {
    params: {
      // 使用 params 选项来传递查询参数
      page,
      pageSize,
      title,
      field: fieldValue, // 注意这里的 key 名称需要和后端一致
      type: typeValue,
      startTime,
      endTime
    }
  })
}

//获取论文详情
export const paperDetailService = ({ id }) => {
  return request.get(`/paper/details/${id}`)
}

//论文添加按钮
export const paperAdd = (form) => {
  return request.post('paper/addPaper', form)
}

//论文更新按钮
export const paperUpdate = (form) => {
  return request.post('paper/update', form)
}

//删除论文
export const paperDelete = ({ id }) => {
  return request.post(`/paper/delete/${id}`)
}
