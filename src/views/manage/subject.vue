<template>
	<section>
		<!-- 题库管理 -->
        <div class="total_name">
            <strong class="total_left">{{$route.name}}</strong>
            <span class="total_right">/  {{$route.name}}</span>
        </div>

		<!-- 按钮操作 -->
		<el-col :span="24" class="toolbar" style="height:60px;lineHeignt:60p;">
			<el-form :inline="true" :model="filters">
				<el-dropdown style="marginRight:30px">
					  <el-button style="backgroundColor:#88a3dc; color:#ffffff; borderRadius:10px;borderColor:white" >
						{{ this.subject_content }}<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown" >
						<el-dropdown-item v-for="(item, index) in subjects" @click.native="xuanZe(item.id, item.name)" ref="xzForm">{{ item.name }}</el-dropdown-item>
					</el-dropdown-menu>			
				</el-dropdown>
			
				<el-form-item>
					<el-button type="primary" @click="addFormVisible = true" v-on:click="handleAdd" size="medium">新增</el-button>
				</el-form-item>

				<!-- 下载文件 -->
				<el-upload
						style="display: inline-block; margin-left: 80px;borderRadius:5px;marginTop:-5px;"
						:multiple='false'
						:auto-upload='true'
						:show-file-list='false'
						:before-upload="beforeUpload1"
						accept=".xls,.xlsx"
						action=""
						:limit="1"
						:http-request="uploadFile1" >
					<el-button size="small" type="warning">下载到本地<i class="el-icon-upload el-icon--right"></i></el-button>
				</el-upload>

				<!-- 上传文件文件 -->
				<el-upload
						style="display: inline-block; margin-left: 20px;borderRadius:5px"
						:multiple='false'
						:auto-upload='true'
						:show-file-list='false'
						:before-upload="beforeUpload"
						action=''
						accept=".xls,.xlsx"
						:limit="1"
						:http-request="uploadFile" >
					<el-button size="small"  type="success">上传文件<i class="el-icon-upload el-icon--right"></i></el-button>
				</el-upload>

				<el-form-item style="marginTop:8px;marginLeft:5px;color:#2c7986;fontSize:14px;">
					 ( 请先下载到本地，在进行上传 )
				</el-form-item>
			</el-form>
		</el-col>

		<!-- 问题列表 -->
		<el-table :data="questions"  highlight-current-row @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="content" label="题目" align="center" @click.native="jump()">
			</el-table-column>
			<el-table-column label="操作"  width="170">
				<template scope="scope">
						<el-button type="primary" size="small" @click="jump(scope.$index, scope.row)">详情</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>

			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<el-col :span="24" class="toolbar">
			<el-pagination 
					layout="prev, pager, next, total" 
					@current-change="handleCurrentChange1"  
					@size-change="handleSizeChange1" :total="total" 
					style="float:right;" 
					ref="pagination1" 
					v-model="pagination"
			>	
			</el-pagination>
		</el-col>

		<!-- 新增界面 -->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" :visible.sync="addFormVisible"  :before-close="handleClose">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">	
				<el-form-item label="问题内容">
					<el-input v-model="addForm.content" clearable type="textarea"></el-input>
				</el-form-item>
				<el-form-item label=" 选 项 一" style="width:70%">
					<el-input v-model="addForm.options[0].content" clearable></el-input>
				</el-form-item>
				<el-form-item label=" 选 项 二" style="width:70%">
					<el-input v-model="addForm.options[1].content" clearable></el-input>
				</el-form-item>
				<el-form-item label=" 选 项 三" style="width:70%">
					<el-input v-model="addForm.options[2].content" clearable></el-input>
				</el-form-item>
				<el-form-item label=" 选 项 四" style="width:70%">
					<el-input v-model="addForm.options[3].content" clearable></el-input>
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
	import qs from 'qs';
	import { getSubjectFL,getQuestion, addQuestion, removeQuestion,downloadFiles,uploadFiles } from '../../api/api.js';
	import axios from 'axios';

	export default {
		data() {
			return {
				sels: [],//列表选中列
				pagesize:20,  // 初始一页条数
				currentPage:1,  // 当前第几页
				total: 0,  // 用于table中:data
				questions: [],  // 问题详情内容
				subjects: [],  // 科目选项卡内容
				pagination: false,  // 切换分页栏
				pagination1: false,  // 分页的ref
				subject_Id: 0,   // 用于添加问题字段
				addLoading: false,  // 添加界面loading
				addFormVisible: false,//新增界面是否显示
				listLoading: false,  // 加载数据loading
				selectQuestion: [],  // 选择之后重新获取数据
				subject_content: '科目选择', // 科目选项卡默认显示
				filters: {  // 用于查询字段
					name: ''
				},
				addFormRules: {  // 添加界面事件
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				addForm: {  // 新增界面数据
					content: '',
					difficulty: "1",
  					fixSignal: 0,
					options: [
						{ content: '', option: '1'},
						{ content: '', option: '2'},
						{ content: '', option: '3'},
						{ content: '', option: '4'},
					],
					rightOption: 1,
					subjectId: this.subject_Id
				},
				xzForm: {  // 选择界面数据
					subjectId: 0,
				}

			}
		},

		methods: {
			handleClose(done) {  //关闭弹框提示
				this.$confirm('确认关闭？')
				.then(_ => {
					done();
				})
				.catch(_ => {});
			},
			beforeUpload (file) {  // 上传文件之前的钩子
				const isText = file.type === 'application/vnd.ms-excel'
				const isTextComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				return (isText | isTextComputer)
			},
			uploadFile (item) {  // 上传文件
				const fileObj = item.file
				const form = new FormData()  // FormData 对象
				form.append('file', fileObj)  // 文件对象
				uploadFiles(form).then(response => {  // 接口请求
					this.$message.info('文件：' + fileObj.name + response.data)
				})
			},
			beforeUpload1 (file) {  // 下载文件之前的钩子
				const isText = file.type === 'application/vnd.ms-excel'
				const isTextComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				return (isText | isTextComputer)
			},
			// 下载文件
			uploadFile1 (item) {
				const fileObj = item.file
				const form = new FormData()  // FormData 对象
				form.append('file', fileObj)  // 文件对象
				downloadFiles(form, {responseType:'arraybuffer'}).then(response => {  // 接口请求
					let blob = new Blob([response.data],{type: 'applocation/x-download'});
					var link = document.createElement('a');
					link.href = window.URL.createObjectURL(blob);
					link.download = item.file.name;
					link.click();
					this.$message.info('文件：' + fileObj.name + '下载成功')
				})
			},
			// 分页控制每页的数量
			handleCurrentChange1(val) {
				this.currentPage = val;
				this.getQuestionInfo();
			},
			// 分页判断点击是第几页
			handleSizeChange1 (size) {
				this.pagesize = size;
				this.getQuestionInfo();
			},	
			//获取题目分类
			getSubject() {
				this.listLoading = true;
				getSubjectFL().then((res) => {
					let a = {name: '全部科目'}  // 题目选项默认值
					this.subjects = res.data.list;
					this.subjects.unshift(a)  // 添加到数据中
				});
			},
			// 获取问题详情内容
			getQuestionInfo() {
				this.listLoading = true;  
				this.pagination = false;
				getQuestion({params: {pageSize: this.pagesize, pageNum: this.currentPage}}).then((res) => {
					this.total = res.data.total;
					this.questions = res.data.list;
				});
			},
			// 题目分类点击切换事件
			xuanZe: function(id, name) {
				this.subject_Id = id;
				this.subject_content = name;
				getQuestion({params: {subjectId: id,pageSize: this.pagesize, pageNum: this.currentPage}}).then((res) => {
					this.total = res.data.total;
					this.selectQuestion = res.data.list;
					this.questions = this.selectQuestion;
				})
			
			},
			// 跳转到详情页面
			jump(index,row) {
				this.$router.push({path: './subject_detial', query:{id: row.id}})
			},
			//删除问题列表
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					removeQuestion(qs.stringify(para)).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getQuestionInfo();
					});
				}).catch(() => {
				});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;	
			},
			//新增问题内容和选项
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = {
								content: this.addForm.content,
								difficulty: "1",  // 默认的
								fixSignal: 0,  // 默认的
								options: [
									{ content: this.addForm.options[0].content, option: '1'},  // option是选项序号，默认的
									{ content: this.addForm.options[1].content, option: '2'},
									{ content: this.addForm.options[2].content, option: '3'},
									{ content: this.addForm.options[3].content, option: '4'},
								],
								rightOption: 1,  // 默认的
								subjectId: this.subject_Id
							}
							addQuestion(para).then((res) => {
								this.addLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getQuestionInfo();
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
			this.getSubject();
			this.getQuestionInfo();
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