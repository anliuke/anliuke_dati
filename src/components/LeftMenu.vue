<template>
    <section class="menu_page">
        <el-row>
             <el-col>
                 <el-menu mode="vertical" background-color="#3a4d6b" text-color="#bfcbd9" active-text-color="#409eff" class="el-menu-vertical-demo">
                     <!-- 首页 -->
                     <router-link to="/home">
                        <el-menu-item index="0">
                            <i class="fa fa-margin fa-server"></i>
                            <span slot="title" style="fontSize:15px">首页</span>
                        </el-menu-item>
                    </router-link>
                    <!-- 左侧列表 -->
                    <template  v-for="item in items" >
                        <el-submenu v-if="item" :index="item.path" :key="item.path">
                            <template slot="title">
                                <i :class="'fa fa-margin '+item.icon"></i>
                                <span slot="title" class="title_item">{{item.name}}</span>
                            </template>
                            <router-link v-for="(citem,cindex) in item.children"
                                :to="citem.path" :key="cindex" class="menu_child">
                                <el-menu-item
                                    :index='citem.path'>
                                    <span slot="title">{{citem.name}}</span>
                                </el-menu-item>
                            </router-link>
                        </el-submenu>
                    </template>
                 </el-menu>
             </el-col>
        </el-row>
    </section>
</template>

<script>
export default {
  name: "leftmenu",

  data() {
    return {
      items: [
          {
              icon: "fa-building-o",
              name: "公司管理",
              path: "company",
              children: [    { path: "company", name: "公司部门" }]
          },
          {
              icon: "fa-address-card-o", 
              name: "用户管理",
              path: "users",
              children: [
                  { path: "users", name: "用户管理" }
              ]
          },
          {
              icon: " fa-book",
              name: "题库管理",
              path: "subject",
              children: [{ path: "subject", name: "题库管理" }]
          },
        //   {
        //       icon: "fa-glide-g",
        //       name: "游戏设置",
        //       path: "games",
        //       children: [{ path: "games", name: "游戏设置" }]
        //   }
      ]
    };
  }
};
</script>

<style scoped>
.title_item{
    font-size: 16px;
}

.menu_page {
    width: 100%;
    height: 100%;
    background-color: #3a4d6b;
}

.el-menu-vertical-demo{
    border: none;
}
</style>
