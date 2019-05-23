import axios from './axios';

// 登录
// export const logIn = params => { return axios.post(`user/login`, params).then(res => res.data); };
export const logIn = params => {
    return  axios({
        url: 'user/login',
        method: 'post',
        data: params
    });
};

// 退出登录
export const logOut = params => { return axios.post(`user/logout`, params).then(res => res.data); };

// 修改密码
export const modifyPassword = params => { return axios.post(`user/modify/password`, params).then(res => res.data); };


// 获取公司信息
export const getCompany = params => { return axios.get(`company/search`, params).then(res => res.data); };

// 获取部门信息
export const getArguments = params => { return axios.get(`organization/search`, params).then(res => res.data); };
// 新增部门信息
export const addArguments = params => { return axios.post(`organization/add`, params).then(res => res.data); };
// 查询部门
export const searchArguments = params => { return axios.post(`organization/get`, params).then(res => res.data); };
// 删除部门
export const removeArguments = params => { return axios.post(`organization/remove`, params).then(res => res.data); };
// 修改部门
export const editArguments = params => { return axios.post(`organization/modify`, params).then(res => res.data); };



// 获取用户信息
export const getUsers = params => { return axios.get(`user/search`, params).then(res => res.data); };
// 添加用户
export const addUsers = params => { return axios.post(`user/add`, params).then(res => res); };
// 删除用户
export const removeUsers = params => { return axios.post(`user/remove`, params).then(res => res); };
// 修改用户
export const modifyUsers = params => { return axios.post(`user/modify`, params).then(res => res); };



// 获取题目分类
export const getSubjectFL = params => { return axios.get(`subject/search`, params).then(res => res.data); };

// 获取问题内容
export const getQuestion = params => { return axios.get(`question/search`, params).then(res => res.data); };
// 添加问题和选项
export const addQuestion = params => { return axios.post(`question/add`, params).then(res => res.data); };
// 删除问题内容
export const removeQuestion = params => { return axios.post(`question/remove`, params).then(res => res.data); };
// 获得问题详情
export const getQuestionDetial = params => { return axios.get(`question/get`, params).then(res => res.data); };
// 修改问题详情
export const modifyQuestionDetial = params => { return axios.post(`question/modify`, params).then(res => res.data); };



// 获取选项 
export const getOption = params => { return axios.get(`question/option/search`, params).then(res => res.data); };
// 修改选项
export const editOption = params => { return axios.post(`question/option/modify`, params).then(res => res.data); }


// 获取问题反馈
export const returnQuestion = params => { return axios.get(`question/fix/search`, params).then(res => res.data); }
// 删除问题反馈
export const removeQuestion_detial = params => { return axios.get(`question/fix/remove`, params).then(res => res.data); }


// 下载文件
export const downloadFiles = params => { return axios.post(`word/convert`, params).then(res => res.data); }
// 上传文件
export const uploadFiles = params => { return axios.post(`office/word/upload`, params).then(res => res.data); }
