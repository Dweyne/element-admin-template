<template>
  <div class="app-container">
    <!-- 卡片视图开始 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix"><span>题目列表</span></div>

      <el-row :gutter="10" class="mb8 flex_center">
        <el-col :span="1.5"><el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button></el-col>
        <el-col :span="8">
          <div class="flex_center">
            <el-input placeholder="通过内容搜索" v-model="searchValue"></el-input>
            <el-button type="primary" @click="searchBigQuestion">搜索</el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="flex_center">
            <el-input placeholder="通过ID搜索" v-model="byIdSearchValue"></el-input>
            <el-button type="primary" @click="searchBigQuestionById">搜索</el-button>
          </div>
        </el-col>
      </el-row>

      <!-- <el-table v-loading="loading" stripe :data="questionList" @selection-change="handleSelectionChange"> -->
      <el-table border v-loading="loading" stripe :data="questionList">
        <!-- <el-table-column prop="title" label="题目标题"></el-table-column> -->
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="题目ID" prop="id" width="80"></el-table-column>
        <el-table-column label="题目内容">
          <template slot-scope="scope">
            <div v-html="$escapeString(scope.row.content)"></div>
          </template>
        </el-table-column>
        <el-table-column prop="courseId" label="课程ID" width="100"></el-table-column>
        <el-table-column label="对抗题目" width="80">
          <template slot-scope="scope">
            {{ scope.row.ispk == 1 ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="date" label="题目类型" width="80">
          <template slot-scope="scope">
            {{ getQuestionType(scope.row.questionType) }}
          </template>
        </el-table-column>
        <el-table-column prop="source" label="题目来源"></el-table-column>
        <el-table-column prop="sourceUser" label="题目来源用户" width="120"></el-table-column>
        <!-- <el-table-column prop="totalScore" label="题目分数"></el-table-column> -->

        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" @click="editQuestion(scope.row)">修改</el-button>
            <el-button type="danger" @click="delQuestion(scope.row.id)">删除</el-button>
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
        <el-form-item label="课程ID"><el-input v-model="addQuestionForm.courseId"></el-input></el-form-item>
        <el-form-item label="问题类型"><el-input v-model="addQuestionForm.questionType"></el-input></el-form-item>
        <el-form-item label="内容"><el-input v-model="addQuestionForm.content"></el-input></el-form-item>
        <el-form-item label="来源"><el-input v-model="addQuestionForm.source"></el-input></el-form-item>
        <el-form-item label="来源用户"><el-input v-model="addQuestionForm.sourceUser"></el-input></el-form-item>
        <el-form-item label="来源用户ID"><el-input v-model="addQuestionForm.sourceUserId"></el-input></el-form-item>
        <el-form-item label="是否是对战题"><el-input v-model="addQuestionForm.isPk"></el-input></el-form-item>
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
import { getQuestionList, addBigQuestion, editBigQuestion, delBigQuestion } from '@/api/exam/index.js';

export default {
  data() {
    return {
      // 搜索内容
      searchValue:'',
      byIdSearchValue:'',
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
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSorts: [
          {
            column: '',
            asc: false
          }
        ],
        pageSize: 10
      },

      // 表单参数
      addQuestionForm: {
        courseId: '',
        questionType: '',
        content: '',
        source: '',
        sourceUser: '',
        sourceUserId: '',
        isPk: ''
      },
      // 表单校验
      addQuestionRules: {},
      questionList: [], //题目列表
      currentOperate: '' //当前操作
    };
  },
  computed: {
    getQuestionType(type) {
      return type => {
        if (type == 1) {
          return '单选';
        } else if (type == 2) {
          return '多选';
        } else if (type == 3) {
          return '不定项';
        } else if (type == 4) {
          return '完形填空';
        } else if (type == 5) {
          return '判断题';
        } else if (type == 6) {
          return '阅读理解7-5';
        } else if (type == 11) {
          return '证明题';
        } else if (type == 12) {
          return '论述题';
        } else if (type == 13) {
          return '计算题';
        } else if (type == 14) {
          return '阅读理解';
        } else if (type == 15) {
          return '分析题';
        } else if (type == 16) {
          return '改错';
        } else if (type == 50) {
          return '其他';
        } else if (type == 61) {
          return '填空题';
        } else {
          return '语法填空';
        }
      };
    }
  },
  created() {
    // 获取题目列表
    this.getQuestionList();
  },
  methods: {
    // 获取题目列表
    getQuestionList() {
      console.log('获取题目列表的参数：');
      console.log(this.queryParams);
      getQuestionList(this.queryParams).then(res => {
        console.log('获取题目列表返回的数据：');
        console.log(res);
        this.questionList = res.data.records;
        this.total = res.data.total;
        this.$message.success('获取题目列表成功！');
        this.loading = false;
      });
    },

    // 搜索大题
    searchBigQuestion(){
      this.queryParams.content = this.searchValue
      this.getQuestionList()
    },

    searchBigQuestionById(){
      this.queryParams.id = this.byIdSearchValue
      this.getQuestionList()
    },

    // 打开编辑问题对话框
    editQuestion(item) {
      this.title = '修改题目';
      // 改变当前操作变量
      this.currentOperate = 'edit';
      this.addQuestionForm = {
        courseId: item.courseId,
        questionType: item.questionType,
        content: item.content,
        source: item.source,
        sourceUser: item.sourceUser,
        sourceUserId: item.sourceUserId,
        isPk: item.isPk
      };
      //打开编辑题目对话框
      this.open = true;
    },

    //编辑问题对话框
    editBigQuestion() {
      let params = {
        ...this.addQuestionForm,
        status: '1'
      };
      console.log('编辑题目的参数：');
      console.log(params);
      editBigQuestion(params).then(res => {
        console.log('编辑题目返回的数据：');
        console.log(res);
        // 重置表单
        this.$refs.addQuestionFormRef.resetField();
        // 关闭编辑题目对话框
        this.open = false;
        // 重置当前操作
        this.currentOperate = '';
      });
    },

    // 分页器每页大小改变时
    handleSizeChange(e) {
      console.log(e);
      this.queryParams.pageSize = e;
      this.getQuestionList();
    },

    // 分页器改变页码时
    handleCurrentChange(e) {
      this.queryParams.pageIndex = e;
      this.getQuestionList();
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
      this.resetForm('form');
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
      this.title = '添加题目';
    },

    /** 提交按钮 */
    submitForm() {
      if (this.currentOperate === 'edit') {
        this.editBigQuestion();
        return;
      }
      // 添加大题
      let params = {
        courseId: this.addQuestionForm.courseId,
        questionType: this.addQuestionForm.questionType,
        title: '',
        content: this.addQuestionForm.content,
        totalScore: '',
        easyError: '',
        source: this.addQuestionForm.source,
        sourceUser: this.addQuestionForm.sourceUser,
        sourceUserId: this.addQuestionForm.sourceUserId,
        isPk: this.addQuestionForm.isPk,
        status: '1',
        version: ''
      };
      console.log('添加大题时的参数：');
      console.log(params);
      addBigQuestion(params).then(res => {
        console.log('添加大题返回的数据：');
        console.log(res);
        this.$message.success('添加题目成功！');
        this.open = false;
        // 重置表单
        this.$refs.addQuestionFormRef.resetField();
        // 刷新大题列表
        this.getQuestionList();
      });
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
    delQuestion(id) {
      this.$confirm('是否确认删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delBigQuestion(id);
        })
        .then(res => {
          console.log('删除题目返回的数据：');
          console.log(res);
          this.$message.success('删除成功！');
          this.getQuestionList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    //文件上传
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res.data.url);
      this.form.img = res.data.url;
    },

    beforeAvatarUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
      }
      return isLt10M;
    }
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
  display: inline-block !important;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
