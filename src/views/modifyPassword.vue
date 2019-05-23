<template>
    <div class="modifyPassword">
        <section class="form_container">
            <div class="manage_tip">
                <span class="title">交工答题管理系统</span>
            </div>
            <!-- ref获取表单内容 -->
            <el-form :model="ruleForm" status-icon :rules="rules" class="ruleForm" ref="ruleForm" label-width="80px">
                <el-form-item label="原密码" prop="oldPassword" style="marginTop:30px;borderRadius:10px">
                    <el-input v-model="ruleForm.pass" placeholder="请输入原密码" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword" style="marginTop:30px;borderRadius:10px">
                    <el-input v-model="ruleForm.newpass" placeholder="请输入新密码" type="password"></el-input>
                </el-form-item>
                <el-form-item class="btn_wrap" style="marginTop:30px;">
                    <el-button type="primary" class="submit_btn" @click="submitForm('ruleForm')" >保 存</el-button>
                </el-form-item>
            </el-form>
        </section>
    </div>
</template>

<script>
import { modifyPassword } from '../api/api.js'
import qs from 'qs'
import { setInterval } from 'timers';

    export default {
        name: "modifypassword",

        data() {
            //自定义验证规则
            var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                if (this.ruleForm.checknewpass !== "") {
                this.$refs.ruleForm.validateField("checknewpass");
                }
                callback();
            }
            };
            var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.ruleForm.newpass) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
            };
            return {
                ruleForm: {},
                rules: {
                    pass: [
                        {
                            required: true,
                            trigger: "blur",
                            message: "请输入密码"
                        }
                    ],
                    newpass: [
                        {
                            validator: validatePass,
                            trigger: "blur",
                            message: "请输入密码"
                        }
                    ]
                }
            };
        },
        methods: {
            time () {
                this.$router.push("./login")
            },
            submitForm(ruleForm) {
                let obj = {
                    oldPassword: this.$md5(this.ruleForm.pass),
                    newPassword: this.$md5(this.ruleForm.newpass)
                }
         
             //是否验证通过
                 modifyPassword(qs.stringify(obj)).then(response => {
                     console.log(response)
                    if (response.msg === "success") {
                        this.$message({
                            message: "保存成功",
                            type: "success"
                            
                        });
                    this.$router.push('./login')
                    } else {
                        this.$message({
                            message: "修改失败，请输入正确的密码",
                            type: "error"
                        });
                    }
                });
            }
        },
    }
</script>


<style scoped>
    .modifyPassword {
        position: absolute;
        width: 100%;
        height: 100%;
        background: url(../assets/images/bg1.jpg) no-repeat center center;
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
        font-family: "Microsoft YaHei";
        font-weight: bold;
        font-size: 36px;
        color: #e4e7ed;
    }

    .ruleForm {
        margin-top: 30px;
        background-color: #fff;
        padding: 20px 40px 20px 20px;
        border-radius: 20px;
        box-shadow: 0px 5px 10px #cccc;
    }

    .submit_btn {
        width: 100%;
        border-radius: 15px;
    }
</style>