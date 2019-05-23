<template>
    <section class="head-nav f-oh">
        <el-row>
            <el-col :span="6" class='logo-container'>
                <!-- <img src="../assets/logo.png" class='logo' alt=""> -->
                <span class='title'>交工答题管理系统</span>
            </el-col>
            <el-col :span='6' class="user">
                <div class="userinfo">
                    <img :src="this.user_info.icon" class='avatar' alt="">
                    <div class='welcome'>
                        <p class='name comename'>欢迎</p>
                        <p class='name avatarname'>{{user_info.organizationName}}  :    {{user_info.realName}}</p>
                    </div>
                    <span class='username'>
                        <el-dropdown trigger="click" @command='setDialogInfo'>
                            <span class="el-dropdown-link">
                                <i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item  command='logout'>退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                     </span>
                </div>
            </el-col>

        </el-row>
    </section>
</template>
<script>
import qs from 'qs';  
import { userInfo } from 'os';
import { logOut,logIn } from '../api/api.js'

export default {

  name: "head-nav",

  data () {
    return {
      user_info: {},  
    }
  },
  created () {
    this.getUser();
  },
  computed: {
    user() {
      // return this.$store.getters.user;
    }
  },
  methods: {
    getUser () {
      logIn(qs.stringify({phone:15988831425,password:this.$md5("123456")})).then((res) => {
          this.user_info = res.data.data;
          console.log(this.user_info)
      }).catch((err) => {
        
      });
    },
    setDialogInfo(cmditem) {
      if (!cmditem) {
        console.log("test");
        this.$message("菜单选项缺少command属性");
        return;
      }
      switch (cmditem) {
        case "info":
          this.showInfoList();
          break;
        case "logout":
          this.logout();
          break;
      }
    },

    // 个人信息
    showInfoList() {
      this.getUser();
      this.$router.push("/infoshow");
    },
    // 退出
    logout() {
      logOut().then((res) => {
          // 页面跳转
          this.$router.push("/login");
      })
    }
  }
};
</script>

<style scoped>
.head-nav {
    background: #eef1f6;
    color: #6d7e96;
}

.logo-container {
  line-height: 60px;
  min-width: 400px;
}

.logo {
  height: 50px;
  width: 50px;
  margin-right: 5px;
  vertical-align: middle;
  display: inline-block;
}

.title {
  vertical-align: middle;
  font-size: 22px;
  /*font-family: "Microsoft YaHei";*/
  letter-spacing: 3px;
  color: #6d7e96;
  font-size: 20px;
  margin-left: 10px;
}

.user {
  line-height: 60px;
  text-align: right;
  float: right;
  padding-right: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  vertical-align: middle;
  display: inline-block;
}

.welcome {
  display: inline-block;
  width: auto;
  vertical-align: middle;
  padding: 0 5px;
}

.name {
  line-height: 20px;
  text-align: center;
  font-size: 14px;
}

.comename {
  font-size: 14px;
}

.avatarname {
  color: #409eff;
  font-weight: bolder;
}

.username {
  cursor: pointer;
  margin-right: 5px;
}
.content-container {
  flex:1;
  padding:20px;
}
.title {
  width: 200px;
  float: left;
  color: #475669;
  font-size: 24px;
}
.userinfo{
    margin-right: 15px;
}
</style>
