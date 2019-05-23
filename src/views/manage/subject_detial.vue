<template>
    <section>   
        <!-- 问题详情显示 -->
          <div class="total_name">
            <strong class="total_left">{{$route.name}}</strong>
            <span class="total_right">/  {{$route.name}}</span>
        </div>

        <!-- 问题详情和正确选项table -->
        <el-row >
            <el-col :span="16"><div class="grid-content bg-purple">{{ this.title }}</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple-light"> 正确选项序号:          {{ this.xuHao}}   </div></el-col>
            <el-col :span="2"><div class="grid-content bg-purple" > 
                <el-button type="primary" size="large" @click="handleEdit_questionDetial" v-on:click="editFormVisible_questionDetial = true"  class="right_1">编辑</el-button>   
            </div></el-col>
        </el-row>

        <!-- 选项列表table -->
        <div class="question_detial">选项列表</div>
        <el-table :data="this.xuanXiang" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="100%">
            <!-- 添加空元素，用于占位，优化页面效果 -->
			<el-table-column  width="35">
			</el-table-column>
			<el-table-column prop="option" label="选项序号">
			</el-table-column>
			<el-table-column prop="content" label="题目选项" align="center" height="40" min-width="1200">
			</el-table-column>
            <!-- 添加空元素，用于占位，优化页面效果 -->
            <el-table-column  width="50">
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template scope="scope">
					<el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)" v-on:click="editFormVisible = true">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>


        <!-- 问题反馈列表table -->
        <div class="question_detial">问题反馈</div>
        <el-button type="danger" size="small" class="deleted" @click="delete_fix">一键删除</el-button>
          <el-table :data="this.fixQuestion" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="100%">
			<el-table-column  width="35">
			</el-table-column>
			<el-table-column prop="content" label="问题详情">
			</el-table-column>
			<el-table-column prop="realName" label="提交人姓名" align="center">
			</el-table-column>
			<el-table-column prop="nickname" label="提交人昵称" align="center">
			</el-table-column>
		</el-table>


        <!--编辑选项弹框-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" :visible.sync="editFormVisible" :before-close="handleClose" width="35%" top="25vh">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="选项内容">
					<el-input  v-model="editForm.content" auto-complete="off" clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

          <!--编辑问题详情弹框-->
		<el-dialog title="编辑" v-model="editFormVisible_questionDetial" 
                                :close-on-click-modal="false" 
                                :visible.sync="editFormVisible_questionDetial"
                                :before-close="handleClose" 
                                width="35%" top="25vh"
            >
			<el-form :model="editForm_quesitonDetial" label-width="80px" :rules="editFormRules" ref="editForm_quesitonDetial">
				<el-form-item label="问题内容">
					<el-input v-model="editForm_quesitonDetial.content" auto-complete="off"  clearable></el-input>
				</el-form-item>
                <el-form-item label="正确选项">
					<el-input  v-model="editForm_quesitonDetial.rightOption" auto-complete="off"  clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible_questionDetial = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit1" :loading="editLoading_questionDetial">提交</el-button>
			</div>
		</el-dialog>
    </section>
</template>

<script>

import qs from 'qs';
import { getQuestionDetial, editOption, getOption, returnQuestion, removeQuestion_detial, modifyQuestionDetial } from '../../api/api.js'

export default {
    data () {
        return {
            title: '',  // 问题内容
            subject_id:0,  // 学科id
            xuHao: '',  // 正确选项序号
            xuanXiang: [],  // 选项数据
            fixQuestion: [],  //问题反馈数据
            difficulty: 1,  //  编辑问题内容参数
            listLoading: false,  // 数据加载loading效果
            id_detial: this.$route.query.id,  // 问题id
            editLoading: false, // 编辑序号界面loading效果
            editFormVisible: false, // 选项编辑界面是否显示
            editLoading_questionDetial: false, // 编辑问题界面loading
            editFormVisible_questionDetial: false, // 问题编辑界面是否显示
            editFormRules: {  // 编辑界面事件
                name: [
                    { required: true, message: '请输入姓名', trigger: 'onBlur' }
                ]
            },
            // 编辑选项界面数据
            editForm:{
                content:'',
                id: 0,
                option: this.xuHao,
                questionId: this.$route.query.id, 
            },
            // 编辑问题详情数据
            editForm_quesitonDetial: {
                content: this.title,
                rightOption: this.xuHao,
                id: 0,
                subjectId: 0
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
        
        selsChange: function (sels) {
            this.sels = sels;
        },

        // 获取题目内容和选项
        questionDetial() {
            getQuestionDetial({params: {id: this.id_detial}}).then((res) => {
                this.title = res.data.content;  // 将数据中问题详情赋值给data中的title
                this.total = res.data.total;   // 用于table的 :total
                this.xuanXiang = res.data.options;  // 选项数据
                this.xuHao = res.data.rightOption;  // 将数据中的正确序号赋值给data中的xuHao
                this.subject_id = res.data.subjectId;  // 学科id，用于接口参数
            
            })

        },
    
        // 获取问题反馈
        getReturnQuestion () {
            returnQuestion({params:{ questionId: this.id_detial}}).then((res) => {
            this.fixQuestion = res.data.list;  // 将问题反馈数据放入数组
            this.total = res.data.total;  //  用于table的:total
            })
        },
        //编辑选项事件
        handleEdit (index,row) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);  // 将输入的内容浅拷贝给form表单，用于接口参数
            console.log(this.editForm)
        },
        // 编辑问题内容和正确选项事件
        handleEdit_questionDetial () {
            this.editFormVisible_questionDetial = true;
            this.editForm_quesitonDetial.content = this.title;  // 将问题内容信息赋值给form表单，类似数据绑定
            this.editForm_quesitonDetial.rightOption = this.xuHao  // 将正确序号信息赋值给form表单，类似数据绑定
            console.log(this.editForm_quesitonDetial)
        },
        // 删除所有问题反馈
        delete_fix: function (index, row) {
            this.$confirm('确认删除所有反馈记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                removeQuestion_detial({params:{ questionId: this.id_detial}}).then((res) => {
                    this.listLoading = false;
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                        this.getReturnQuestion();  // 改变状态，刷新数据
                    });
                }).catch(() => {

            });
        },
        //编辑问题详情，正确序号
        editSubmit1: function () {
            this.$refs.editForm_quesitonDetial.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading_questionDetial = true;
                        let para = {    content: this.title,
                                        rightOption: this.xuHao,
                                        id: this.id_detial,
                                        subjectId: this.subject_id,
                                        difficulty:this.difficulty
                                    }
                        modifyQuestionDetial(para).then((res) => {
                            this.editLoading_questionDetial = false;
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$refs['editForm_quesitonDetial'].resetFields();
                            this.editFormVisible_questionDetial = false;
                            this.questionDetial();
                        });
                            
                        
                    });
                }
            });
            this.title = this.editForm_quesitonDetial.content;  // 将输入的数据赋值给title,刷新页面数据
            this.xuHao = this.editForm_quesitonDetial.rightOption;  // 将输入的正确序号赋值给xuHao，刷新页面数据
        },

        //编辑选项
        editSubmit: function () {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true;
                        let para = Object.assign({}, this.editForm);
                        editOption(para).then((res) => {
                            this.editLoading = false;
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$refs['editForm'].resetFields();
                            this.editFormVisible = false;
                            this.questionDetial();
                        });
                        
                    });
                }
            });
        },
    },
    // 进入项目初次挂载数据
    created () {
        this.questionDetial();
        this.getReturnQuestion()
    }

}
</script>

<style scoped>
.total_name{
    height: 26px;
    line-height:26px;
    margin-top:-10px;
    background-color:#d3dce6;
}
.total_left{
    font-size: 20px;
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
 .el-row {
    margin-bottom: 10px;
    height: 50px;
    line-height: 50px;
    margin-top: 15px;
    font-size: 17px;
    background-color:#f2f2f2;
  }
  .el-col {
    border-radius: 4px;
  }
  
  .grid-content {
    border-radius: 4px;
    min-height: 36px;

  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .question_detial{
    height:26px;
    line-height: 26px;
    color: #475669;
    margin-top: 10px;
    margin-bottom:8px;
    font-size: 20px;
    background-color:#d3dce6;
  }
  .deleted{
      position: relative;
      left: 93%;
      top: 0;
  }
</style>


