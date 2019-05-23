<template>
	<section>
		<!-- 用户管理 -->
        <div class="total_name">
            <strong class="total_left">{{$route.name}}</strong>
            <span class="total_right">/  {{$route.name}}</span>
        </div>

		<!-- 搜索，添加用户 -->
		<el-col :span="24" class="toolbar"  style="height:60px;lineHeight:60px;marginTop:-5px">
			<el-form :inline="true" :model="filters">
				<!-- 部门下拉菜单 -->
				<el-dropdown style="marginRight:20px;position:relative;top:-10px;left:0">
					<el-button style="backgroundColor:#88a3dc; color:#ffffff; borderRadius:10px;borderColor:white" >
						{{ this.argumentSearch }}<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown" >
						<el-dropdown-item v-for="(item, index) in argument" @click.native="xuanZe(item.id, item.name)">{{ item.name }}</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>

				<el-form-item>
					<el-input v-model="filters.realName" placeholder="用户姓名" clearable size="medium"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  size="medium" @click="searchUsersRealName">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.nickname"  placeholder="用户昵称" clearable size="medium"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  size="medium" @click="searchUsersNickName">查询</el-button>
				</el-form-item>
					<el-form-item>
					<el-input  v-model="filters.phone" placeholder="用户手机号" clearable size="medium"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  size="medium" @click="searchUsersPhone">查询</el-button>
				</el-form-item>
			
				<el-form-item>
					<el-button type="primary" @click="addFormVisible = true" size="large" style="marginLeft:30px;background:#588cd0; width:80px">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!-- 用户列表 -->
		<el-table :data="users"   @selection-change="selsChange" v-loading="listLoading" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="icon" label="头像" max-width="60" >
				<template scope="scope">
　　　　			<img :src="scope.row.icon" width="40" height="40" class="icon"/>
　　			</template>
			</el-table-column>
			<el-table-column prop="realName" label="姓名" min-width="100" >
			</el-table-column>
			<el-table-column prop="nickname" label="昵称" min-width="130" >
			</el-table-column>
			<el-table-column prop="organizationName" label="所属部门" min-width="100" >
			</el-table-column>
			<el-table-column prop="phone" label="手机号" min-width="130" >
			</el-table-column>
			<el-table-column prop="points" label="积分" min-width="75" >
			</el-table-column>
			<el-table-column prop="grade" label="等级" min-width="75" >
			</el-table-column>
			<el-table-column prop="allRounds" label="总对战回合" min-width="75" >
			</el-table-column>
			<el-table-column prop="winPercentage" label="胜率" min-width="75" >
			</el-table-column>
			<el-table-column prop="id" label="id" min-width="100">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-on:click="editFormVisible = true">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next, total"  @current-change="handleCurrentChange"   @size-change="handleSizeChange" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
			<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" :visible.sync="editFormVisible" :before-close="handleClose" width="35%" top="25vh">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名">
					<el-input v-model="editForm.realName" clearable></el-input>
				</el-form-item>
				<el-form-item label="昵称">
					<el-input v-model="editForm.nickname" clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>


		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" :visible.sync="addFormVisible"  :before-close="handleClose" width="35%" top="25vh">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">	
				<el-form-item label="手机号">
					<el-input v-model="addForm.phone" clearable style="width:75%;"></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="addForm.password" type="password"  style="width:75%;" clearable></el-input>
				</el-form-item>
				<el-dropdown class="xl_item">
					  <el-button style="backgroundColor:#88a3dc; color:#ffffff; borderRadius:10px;borderColor:white;" >
						{{ this.add_ArgumentSearch }}<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown" >
						<el-dropdown-item v-for="(item, index) in argument" @click.native="xuanZe_addArgument(item.id, item.name)">{{ item.name }}</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-form>
			<div slot="footer" class="dialog-footer" style="marginTop:-30px;">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
    import qs from 'qs'
	import { getUsers,removeUsers,modifyUsers,getArguments,addUsers } from '../../api/api.js';
	import axios from 'axios';

	export default {
		data() {
			return {
				sels: [],//列表选中列
				users: [],  // 用户列表
				pagesize:20,  // 初始一页条数
				currentPage:1,  // 当前第几页
				total: 0,  // 用于table的 :total
				argument: [],  //用户展示页部门列表
				listLoading: false,  // 数据加载loading
				editLoading: false,  // 编辑界面loading
				addLoading: false,  // 添加界面loading
				addFormVisible: false,//新增界面是否显示
				editFormVisible: false,  // 编辑界面是否显示
				argumentSearch: '部门查询',  // 部门查询列表默认显示
				add_ArgumentSearch: '部门',  // 添加界面部门添加默认显示
				filters: {  // 查询条件数据
					realName: '',
					nickname: '',
					phone: '',
				},
				//编辑界面数据
				editForm: {
					id: 0,
					realName: '',
					nickname: '',
				},
				//新增界面数据
				addForm: {
					phone: '',
					password: '',
					organizationId: 0
				},
				editFormRules: {  // 编辑界面方法
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},	
				addFormRules: {  // 添加界面方法
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				

			}
		},
		
		methods: {
	
			//关闭弹框提示
			handleClose(done) {
				this.$confirm('确认关闭？')
				.then(_ => {
					done();
				})
				.catch(_ => {});
			},
			// 控制每页的数量--分页
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getUserInfo();
			},
			// 判断点击是第几页--分页
			handleSizeChange (size) {
				this.pagesize = size;
				this.getUserInfo();
			},	
			
			//获取用户列表
			getUserInfo() {
				this.listLoading = true;
				 getUsers({params: {pageSize: this.pagesize, pageNum: this.currentPage}}).then((res) => {  // 传递pageSize,pageNum，用于分页
					this.users = res.data.list;  // 用户列表数据
					console.log(this.users)
					this.total = res.data.total;  // 用于table的 :total
					this.listLoading = false;
				});
			},

			// 获取公司部门
			getArgumentsInfo () {
				getArguments().then((res) => {
					let a = {name:'所有部门',id: null}  // 在部门列表添加
					this.argument = res.data.list
					this.argument.unshift(a)  // 将此对象放入部门列表数组中
				})
			},

			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					phone: '',
					password: '',
					organizationId: 0
				};
			},

			// 用户列表部门查询
			xuanZe(id,name){
				this.argumentSearch = name;  // 将数据中部门name值赋值给下拉菜单，更新部门下拉菜单名字显示
				this.listLoading = true;
				getUsers({params: {organizationId: id,pageSize: this.pagesize, pageNum: this.currentPage}}).then((res) => {
					this.total = res.data.total;
					this.users = res.data.list
					this.listLoading = false;
				})
			},


			// 新增界面用户列表查询
			xuanZe_addArgument(id,name) {
				this.add_ArgumentSearch = name;
				// 将部门id传递过去
				this.addForm.organizationId = id;
			},

			// 查询用户姓名
			searchUsersRealName() {
				this.listLoading = true;
				getUsers({params: { realName: this.filters.realName}}).then((res) => {  // 将filters的realName字段拼接在接口
					this.total = res.data.total;
					this.users = res.data.list
					this.listLoading = false;
				})
				
			},

			// 查询用户昵称
			searchUsersNickName() {
				this.listLoading = true;
				getUsers({params: { nickname: this.filters.nickname}}).then((res) => {  // 将filters的realName字段拼接在接口
					this.total = res.data.total;
					this.users = res.data.list
					this.listLoading = false;
				})
			},

			// 查询用户手机号
			searchUsersPhone() {
				this.listLoading = true;
				getUsers({params: { phone: this.filters.phone}}).then((res) => {  // 将filters的phone字段拼接在接口
					this.total = res.data.total;
					this.users = res.data.list
					this.listLoading = false;
				})
			},

			//删除用户
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUsers(qs.stringify(para)).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUserInfo();
					});
				}).catch(() => {

				});
			},
			
			//编辑用户
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = { userId: this.editForm.id, realName: this.editForm.realName, nickname: this.editForm.nickname}
							modifyUsers(qs.stringify(para)).then((res) => {
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUserInfo();
							});
						});
					}
				});
			},

			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = {phone: this.addForm.phone, organizationId: this.addForm.organizationId, password: this.$md5(this.addForm.password),organizationId:this.addForm.organizationId};
							addUsers(qs.stringify(para)).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUserInfo();
							});
						});
					}
				});
			},
		selsChange: function (sels) {
				this.sels = sels;
			},
		},
		mounted() {
			this.getUserInfo();	
			this.getArgumentsInfo()
		},

	}

</script>

<style scoped>
.total_name{
    height: 32px;
    line-height:32px;
    margin-top:-10px;
	margin-bottom: 15px;
    background-color:#d3dce6;
}
.total_left{
    font-size: 24px;
    color: #475669;
    height: 100%;
    display: block;
    float: left;
}
.total_right {
    display: block;
    float: right;
    color: #475669;
}
.xl_item{
	position: relative;
	left: 82%;
	top:-130px;
}
.icon {
	border-radius: 50%;
	border: 1px solid #ccc;
}
</style>