<template>
	<section>
		<!-- 公司管理 -->
        <div class="total_name">
            <strong class="total_left">{{$route.name}}</strong>
            <span class="total_right">/  {{$route.name}}</span>
        </div>
		<!--公司详情-->
		<el-row style="background:#d3dce6;height:40px;lineHeight:40px;">
				<el-col :span="6"><div><span class="grid-content">公司名称</span> :  <span class="bg-purple">{{ this.company_data.name}}</span></div></el-col>
				<el-col :span="6"><div><span class="grid-content">公司类型</span> :  <span class="bg-purple">{{ this.company_data.business}}</span></div></el-col>
				<el-col :span="6"><div><span class="grid-content">公司描述</span> :  <span class="bg-purple">{{ this.company_data.description}}</span></div></el-col>
				<el-col :span="6"><div><span class="grid-content">公司方向</span> :  <span class="bg-purple">{{ this.company_data.contact}}</span></div></el-col>
		</el-row>

		<!-- 搜索，添加部门 -->
		<el-col :span="24" class="toolbar" style="height:60px;lineHeight:60px">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="部门名称" clearable size="medium "></el-input>
				</el-form-item>
				<el-form-item>
						<el-button type="primary" v-on:click="getCompanyArguments" size="medium">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="addFormVisible = true" size="medium">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--部门列表-->
		<el-table :data="company_arguments" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="100%">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="部门名称" align="center">
			</el-table-column>
		
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-on:click="editFormVisible = true">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel( scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false"  :visible.sync="editFormVisible" :before-close="handleClose" width="35%" top="25vh">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="公司部门">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" :visible.sync="addFormVisible" :before-close="handleClose"  width="35%" top="25vh">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="部门名称">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
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
	import qs from 'qs'	;  // 用于接口传参
	import { getCompany, getArguments, addArguments, removeArguments, editArguments, searchArguments } from '../../api/api.js'; // 接口
	export default {
		data() {
			return {
				filters: { // 用于搜索部门数据
					name: ''
				},
				company_data: {}, // 公司信息
				total: 0,  // 部门table列表数据
				company_arguments: [],  // 部门信息
				listLoading: false,  // 页面加载loading
				editLoading: false,  // 编辑界面loading
				addLoading: false,  // 新增界面loading
				editFormVisible: false,//编辑界面是否显示
				addFormVisible: false,// 新增界面是否显示
				//编辑界面数据
				editForm: {
					name: '',
					id: 0
				},
				//新增界面数据
				addForm: {
					name: '',
					companyId: 2
				},
				addFormRules: {  //新增input事件
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				editFormRules: {  // 编辑input事件
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

		//显示编辑界面
		handleEdit: function (index, row) {
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row); // 将编辑的form数据进行浅拷贝
		},
		//显示新增界面
		handleAdd: function () {
			this.addFormVisible = true;
			this.addForm = {
				name: ''
			};
		},

		selsChange: function (sels) {
			this.sels = sels;
		},

		// 获取公司信息
		getCompanyInfo () {
				this.listLoading = true;
				getCompany().then((res) => {
					this.company_data = res.data.list[0];
					this.listLoading = false;
				});
		},

		// 获取部门信息 ( 查询部门 )
		getCompanyArguments () {
			let para = {
				name: this.filters.name
			};  // 将name字段传参，用于查询
			this.listLoading = true;
			getArguments({params: {name: this.filters.name}}).then((res) => {
				this.company_arguments = res.data.list;
				this.listLoading = false;
			});
		},

		//新增部门
		addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.addLoading = true;
						let para = Object.assign({}, this.addForm);
						addArguments(para).then((res) => {
							this.addLoading = false;
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							this.$refs['addForm'].resetFields();
							this.addFormVisible = false;
							this.getCompanyArguments();
						});
					});
				}
			});
		},
		
		//删除部门
		handleDel: function (index, row) {
			this.$confirm('确认删除该记录吗?', '提示', {
				type: 'warning'
			}).then(() => {
				this.listLoading = true;
				let para = { id: row.id };
				removeArguments(qs.stringify(para)).then((res) => {
					this.listLoading = false;
					this.$message({
						message: '删除成功',
						type: 'success'
					});
						this.getCompanyArguments();
					});
				}).catch(() => {
			});
		},

		//编辑部门
		editSubmit: function () {
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true;
						let para = Object.assign({}, this.editForm);
						editArguments(para).then((res) => {
							this.editLoading = false;
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							this.$refs['editForm'].resetFields();
							this.editFormVisible = false;
							this.getCompanyArguments();
						});
						
					});
				}
			});
		},

		
		},
		mounted() {
			this.getCompanyInfo();	
			this.getCompanyArguments();
		}
	}

</script>

<style scoped>
.total_name{
    height: 32px;
    line-height:32px;
    margin-bottom:10px;
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
.grid-content {
    font-size: 15px;
    font-family: '微软雅黑';
    color:#456185
}
.bg-purple{
    font-size: 19px;
    color: #112924c9;
    font-family: '宋体'
}

</style>