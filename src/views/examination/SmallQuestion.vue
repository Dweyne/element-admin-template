<template>
  <div class="app-container">

    <!-- 卡片视图开始 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>小题列表</span>
      </div>

      <el-row :gutter="10" class="mb8 flex_center">
        <el-col :span="1.5"><el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button></el-col>
        <el-col :span="8">
          <div class="flex_center">
            <el-input placeholder="通过大题ID搜索" v-model="byExerciseIdSearchValue"></el-input>
            <el-button type="primary" @click="searchSmallQuestionByExerciseId">搜索</el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="flex_center">
            <el-input placeholder="通过ID搜索" v-model="byIdSearchValue"></el-input>
            <el-button type="primary" @click="searchSmallQuestionById">搜索</el-button>
          </div>
        </el-col>
      </el-row>

      <!-- <el-table v-loading="loading" stripe :data="questionList" @selection-change="handleSelectionChange"> -->
      <el-table border v-loading="loading" stripe :data="questionList">
        <!-- <el-table-column prop="title" label="题目标题"></el-table-column> -->
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="exerciseId" label="大题ID"></el-table-column>
        <el-table-column label="小题类型">
          <template slot-scope="scope">
            {{getQuestionType(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="题目内容">
          <template slot-scope="scope">
            <div v-html="$escapeString(scope.row.question)"></div>
          </template>
        </el-table-column>
        <el-table-column prop="answer" label="正确答案"></el-table-column>
        <el-table-column prop="totalScore" label="分数"></el-table-column>
        <el-table-column prop="difficulty" label="难度"></el-table-column>
        <el-table-column prop="accuracy" label="正确率"></el-table-column>
        <el-table-column label="是否能做">
          <template slot-scope="scope">
            {{scope.row.cando === 1?'是':'否'}}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" @click="openEditQuestionDialog(scope.row)">修改</el-button>
            <el-button type="danger" @click="delSmallQuestion(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pageIndex"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 卡片视图结束 -->

    <!-- 添加或修改题目对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" align="center">

      <el-form ref="addQuestionFormRef" :model="addQuestionForm" :rules="addQuestionRules" label-width="100px">
         <!-- 表单主体 -->
        <el-form-item label="大题ID">
            <el-input v-model="addQuestionForm.bigQuestionId"></el-input>
        </el-form-item>
        <el-form-item label="问题类型">
            <el-input v-model="addQuestionForm.type"></el-input>
        </el-form-item>
        <el-form-item label="题目内容">
            <el-input v-model="addQuestionForm.content"></el-input>
        </el-form-item>
        <el-form-item label="正确答案">
            <el-input v-model="addQuestionForm.answer"></el-input>
        </el-form-item>
        <el-form-item label="分数">
            <el-input v-model="addQuestionForm.score"></el-input>
        </el-form-item>
        <el-form-item label="难度">
            <el-input v-model="addQuestionForm.difficulty" placeholder="1-5的数字"></el-input>
        </el-form-item>
        <el-form-item label="正确率">
            <el-input v-model="addQuestionForm.accuracy" placeholder="1-100的数字"></el-input>
        </el-form-item>
        <el-form-item label="是否能做">
            <el-input v-model="addQuestionForm.canDo" placeholder="0为不能做,1为能做"></el-input>
        </el-form-item>

      </el-form>

      <!-- 对话框底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>

    </el-dialog>

  </div>
</template>

<script>
import { getSmallQuestionList, addSmallQuestion, editSmallQuestion, delSmallQuestion } from "@/api/exam/index.js";

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams:{
       	"pageIndex": 1,
       	"pageSorts": [
       		{
       			"column": "",
       			"asc": false
       		}
       	],
       	"pageSize": 10

      },

      // 表单参数
      addQuestionForm: {
        bigQuestionId:'',
        answer:'',
        type:'',
        content:'',
        score:'',
        difficulty:'',
        accuracy:'',
        canDo:'',
      },
      // 表单校验
      addQuestionRules: {

      },
      questionList:[],  //题目列表
      currentOperate:'',  //当前操作
      byExerciseIdSearchValue:'',
      byIdSearchValue:'',
    };
  },
  computed:{
    getQuestionType(type){
      return type => {
        if(type == 1){
        	return '单选'
        }else if(type == 2){
        	return '多选'
        }else if(type == 3){
        	return '不定项'
        }else if(type == 4){
        	return '完形填空'
        }else if(type == 5){
        	return '判断题'
        }else if(type == 6){
        	return '阅读理解7-5'
        }else if(type == 11){
        	return '证明题'
        }else if(type == 12){
        	return '论述题'
        }else if(type == 13){
        	return '计算题'
        }else if(type == 14){
        	return '阅读理解'
        }else if(type == 15){
        	return '分析题'
        }else if(type == 16){
        	return '改错'
        }else if(type == 50){
        	return '其他'
        }else if(type == 61){
        	return '填空题'
        }else{
        	return '语法填空'
        }
      }
    }
  },
  created() {

    // 获取题目列表
    this.getSmallQuestionList()
  },
  methods: {

    // 获取题目列表
    getSmallQuestionList(){
      console.log('获取题目列表的参数：');
      console.log(this.queryParams);
      getSmallQuestionList(this.queryParams).then(res => {
        console.log('获取题目列表返回的数据：');
        console.log(res);
        this.questionList = res.data.records
        this.total = res.data.total
        this.$message.success('获取题目列表成功！')
        this.loading = false
      })
    },

    // 搜索大题
    searchSmallQuestionByExerciseId(){
      this.queryParams.exerciseId = this.byExerciseIdSearchValue
      this.getSmallQuestionList()
    },

    searchSmallQuestionById(){
      this.queryParams.id = this.byIdSearchValue
      this.getSmallQuestionList()
    },

    // 打开编辑问题对话框
    openEditQuestionDialog(item){
      console.log('要编辑的小题的信息：');
      console.log(item);
      this.title = "修改题目"
      // 改变当前操作变量
      this.currentOperate = 'edit'
      this.addQuestionForm = {
        bigQuestionId:item.exerciseId,
        answer:item.answer,
        type:item.type,
        content:item.question,
        score:item.totalScore,
        difficulty:item.difficulty,
        accuracy:item.accuracy,
        canDo:item.cando,
        id:item.id
      }
      //打开编辑题目对话框
      this.open = true

    },

    //编辑问题对话框
    editSmallQuestion(){
      let params = {
        ...this.addQuestionForm
      }
      console.log('编辑题目的参数：');
      console.log(params);
      editSmallQuestion(params).then(res => {
        console.log('编辑题目返回的数据：');
        console.log(res);
        if (res.code === 200) {
          this.$message.success('修改成功！')
        }
        // 重置表单
        // this.$refs.addQuestionFormRef.resetField()
        // 关闭编辑题目对话框
        this.open = false
        // 重置当前操作
        this.currentOperate = ''
      })
    },

    // 分页器每页大小改变时
    handleSizeChange(e) {
      console.log(e);
      this.queryParams.pageSize = e;
      this.getSmallQuestionList();
    },

    // 分页器改变页码时
    handleCurrentChange(e) {
      this.queryParams.pageIndex = e;
      this.getSmallQuestionList();
    },
    /** 查询首页轮播图列表 */
    // getList() {
    //   this.loading = true;
    //   listBanner(this.queryParams).then(response => {
    //     this.bannerList = response.data.records;
    //     this.total = parseInt(response.data.total);
    //     this.loading = false;
    //   });
    // },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = {
        id: 0,
        img: undefined,
        url: undefined

      };
      this.resetForm("form");
    },

    // 多选框选中数据
    // handleSelectionChange(selection) {
    //   this.ids = selection.map(item => item.id)
    //   this.single = selection.length!=1
    //   this.multiple = !selection.length
    // },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加题目";
    },

    /** 提交按钮 */
    submitForm() {
      if (this.currentOperate === 'edit') {
        this.editSmallQuestion()
        return
      }
      // 添加小题
      let params = {
        	"exerciseId": this.addQuestionForm.bigQuestionId,
        	"type": this.addQuestionForm.type,
        	"question": this.addQuestionForm.content,
        	"answer": this.addQuestionForm.answer,
        	"totalScore": this.addQuestionForm.score,
        	"difficulty": this.addQuestionForm.difficulty,
        	"accuracy": this.addQuestionForm.accuracy,
        	"cando": this.addQuestionForm.canDo,
      }
      console.log('添加小题时的参数：');
      console.log(params);
      addSmallQuestion(params).then(res => {
        console.log('添加小题返回的数据：');
        console.log(res);
        this.$message.success('添加题目成功！')
        this.open = false
        // 重置表单
        this.$refs.addQuestionFormRef.resetField()
        // 刷新大题列表
        this.getSmallQuestionList()
      })
      // this.$refs["form"].validate(valid => {
      //   if (valid) {
      //       console.log(this.form)
      //       addBanner(this.form).then(response => {
      //         if (response.code === 200) {
      //           this.msgSuccess("新增成功");
      //           this.open = false;
      //           this.imageUrl='';
      //           this.getList();
      //         } else {
      //           this.msgError(response.msg);
      //         }
      //       });

      //   }
      // });
    },
    /** 删除按钮操作 */
    delSmallQuestion(id) {

      this.$confirm('是否确认删除该题?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          console.log('删除模考前的参数：');
          console.log(id);
          delSmallQuestion(id).then(res => {
            console.log('删除模考信息返回的数据：');
            console.log(res);
            if (res.code === 200) {
              this.$message.success('删除成功！');
              // 更新模考列表
              this.getSmallQuestionList();
            }
          });
        })
    },
    //文件上传
  //   handleAvatarSuccess(res, file) {
  //          this.imageUrl = URL.createObjectURL(file.raw);
  //          console.log(res.data.url)
  //          this.form.img=res.data.url
  //        },

  //   beforeAvatarUpload(file) {

  //          const isLt10M = file.size / 1024 / 1024 < 10;
  //          if (!isLt10M) {
  //            this.$message.error('上传头像图片大小不能超过 10MB!');
  //          }
  //          return isLt10M;
  //        }
  }
};
</script>
<style scoped>
  .flex_center{
    display: flex;
    align-items: center;
  }
  .el-pagination{
    margin-top: 50px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block!important;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
