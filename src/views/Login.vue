
<template>
    <div class="login">
        <section class="form_container">
            <div class="manage_tip">
                <span class="title">交工答题管理系统</span>
            </div>
            <el-form :model="loginUser" status-icon :rules="rules" ref="loginForm" class="loginForm" label-width="80px">
                <el-form-item label="手机" prop="phone" style="marginTop:30px">
                    <el-input v-model="loginUser.phone" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" style="marginTop:30px">
                    <el-input v-model="loginUser.password" placeholder="请输入密码" type="password"></el-input>
                </el-form-item>
                <el-form-item style="marginTop:40px">
                    <el-button type="primary" @click="submitForm('loginForm')" @keyup.enter.native="submitForm('registerForm')" class="submit_btn"> 登    录 </el-button>
                    
                    <router-link to ='/modifyPassword'><el-button type="primary"   class="resetPassword_btn" size="medium"> 修改密码 </el-button></router-link>
                </el-form-item>
            </el-form>
        </section>
    </div>
</template>

<script>

// import jwt_decode from "jwt-decode";
import qs from 'qs'
import { logIn } from '../api/api.js'

export default {
    name: "login",

    data() {
      // 正则匹配手机号
      let checkPhone = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('手机号不能为空'));
          } else {
            const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
            if (reg.test(value)) {
              callback();
            } else {
              return callback(new Error('请输入正确的手机号'));
            }
        }
      };

    return {
      loginUser: {  // 登录初始数据
        phone: "",
        password: ""
      },
      loading:false,  // 加载数据loading
      checked: true,  
      rules: {
          phone: [
            { required: true, message: "账号不能为空", trigger: "blur" },
            { min: 11, max: 11, validator: checkPhone,  message: "请输入11位手机号", trigger: "blur" }
          ],
          password: [
            { required: true, message: "密码不能为空", trigger: "blur" },
            { min: 6, max: 30, message: "请输入正确的数字", trigger: "blur" }
          ]
        }
     };
  },

  methods: {

    submitForm(formName) {
      
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
            let para = { phone: this.loginUser.phone, password: this.$md5(this.loginUser.password)}
            logIn(qs.stringify(para)).then(res => {
            let data = res.data.data;
            console.log(data)
            console.log(res)
            localStorage.setItem('phone','this.data.phone')
            if( !data ){
              // 登录失败提示
              this.$message({
                  message: '请使用管理员账号密码登录',
                  type: 'error'
                });
            } else {
              this.$router.push("/index");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  }
};
</script>

<style scoped>
.login {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(../assets/images/bg1.jpg) no-repeat;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 20%;
  left: 34%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-weight: bold;
  font-size: 36px;
  color: #e4e7ed;
}
.loginForm {
  margin-top: 30px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 20px;
  box-shadow: 0 5px 10px #cccc;
}

.submit_btn {
  width: 50%;
  margin-left: -40px;
  border-radius: 20px;
}
.resetPassword_btn{
  margin-left: 40px;
  border-radius: 20px;
  background-color: #909399;
  border-color: #fff;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
  margin: -20px 185px 30px 0;
}
.tiparea p a {
  color: #409eff;
}

.rember {
  margin-left: -60px;
  margin-bottom: 20px;
}
</style>


