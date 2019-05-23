<template>
	<section>

         <div class="total_name">
            <strong class="total_left">{{$route.name}}</strong>
            <span class="total_right">/  {{$route.name}}</span>
        </div>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="height:60px;lineHeight:60px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="用户姓名" clearable size="medium"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="medium">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="addFormVisible = true" size="medium">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="tableData" highlight-current-row  @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="image" label="头像" max-width="60" >
				  <template   slot-scope="scope">            
                    <img src="https://www.baidu.com/img/bd_logo1.png"  width="30px" height="30px" style="borderRadius:50%"/>
                 </template> 
			</el-table-column>
			<el-table-column prop="sex" label="昵称" min-width="120" >
			</el-table-column>
			<el-table-column prop="name" label="姓名" min-width="120" >
			</el-table-column>
			<el-table-column prop="age" label="手机号" min-width="120" >
			</el-table-column>
			<el-table-column prop="addr" label="地址" min-width="180">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-on:click="editFormVisible = true">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
			<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" :visible.sync="editFormVisible" :before-close="handleClose">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="昵称" prop="sex">
					<el-input v-model="editForm.name" auto-complete="off" clearable></el-input>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input v-model="editForm.name" clearable></el-input>
				</el-form-item>
				<el-form-item label="手机号">
					<el-input v-model="editForm.age" clearable></el-input>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr" clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>


		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" :visible.sync="addFormVisible"  :before-close="handleClose">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">	
				<el-form-item label="昵称">
					<el-input v-model="addForm.sex" clearable></el-input>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input v-model="addForm.name" clearable></el-input>
				</el-form-item>
				<el-form-item label="手机号">
					<el-input v-model="addForm.age" clearable></el-input>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr" clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				tableData: [{
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄',
					tag: '家'
					}, {
					name: '王小虎',
					address: '上海市普陀区金沙江路 1517 弄',
					tag: '公司'
					}, {
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄',
					tag: '家'
					}, {
					name: '王小虎',
					address: '上海市普陀区金沙江路 1516 弄',
					tag: '公司'
       			 }],
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex:  '',
					age: '',
					birth: '',
					addr: '',
					image: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					sex: '',
					age: '',
					birth: '',
					addr: '',
					image: ''
				}

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
			handleCurrentChange(val) {
				this.page = val;
				// this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						// this.getUsers();
					});
				}).catch(() => {

				});
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
					name: '',
					sex: '',
					age: '',
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								// this.getUsers();
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
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								// this.getUsers();

							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						// this.getUsers();

					});
				}).catch(() => {

				});
			},
		},
		mounted() {
			// this.getUsers();
		}
	}

</script>

<style scoped>
.total_name{
    height: 32px;
    line-height:32px;
    margin-top:-10px;
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
</style>