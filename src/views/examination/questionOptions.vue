<template>
  <div class="app-container">
    <!-- 卡片视图开始 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix"><span>选择题选项列表</span></div>

      <el-row :gutter="10" class="mb8 flex_center">
        <el-col :span="1.5"><el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button></el-col>
        <el-col :span="8">
          <div class="flex_center">
            <el-input placeholder="通过小题ID搜索选项" v-model="searchValue"></el-input>
            <el-button type="primary" @click="searchBigQuestion">搜索</el-button>
          </div>
        </el-col>
        <!-- <el-col :span="8">
          <div class="flex_center">
            <el-input placeholder="通过ID搜索" v-model="byIdSearchValue"></el-input>
            <el-button type="primary" @click="searchBigQuestionById">搜索</el-button>
          </div>
        </el-col> -->
      </el-row>

      <!-- <el-table v-loading="loading" stripe :data="optionList" @selection-change="handleSelectionChange"> -->
      <el-table border v-loading="loading" stripe :data="optionList">
        <!-- <el-table-column prop="title" label="选项标题"></el-table-column> -->
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="选项ID" prop="id"></el-table-column>
        <el-table-column label="小题ID" prop="qaId"></el-table-column>
        <el-table-column label="选项排序" prop="sort"></el-table-column>
        <el-table-column label="选项值" prop="val"></el-table-column>

        <el-table-column label="选项内容">
          <template slot-scope="scope">
            <div v-html="$escapeString(scope.row.text)"></div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" @click="openEditOption(scope.row)">修改</el-button>
            <el-button type="danger" @click="delOption(scope.row.id)">删除</el-button>
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

    <!-- 添加或修改选项对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" align="center">
      <el-form ref="addOptionFormRef" :model="addOptionForm" :rules="addOptionRules" label-width="100px">
        <!-- 表单主体 -->
        <el-form-item label="小题ID"><el-input v-model="addOptionForm.qaId"></el-input></el-form-item>
        <el-form-item label="选项值"><el-input v-model="addOptionForm.val"></el-input></el-form-item>
        <el-form-item label="内容"><el-input v-model="addOptionForm.text"></el-input></el-form-item>
        <el-form-item label="排序"><el-input v-model="addOptionForm['sort']"></el-input></el-form-item>
      </el-form>

      <!-- 对话框底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOptionDialog">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOptionList, addOption, editOption, delOption } from '@/api/exam/index.js';

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
        pageSize: 10
      },

      // 表单参数
      addOptionForm: {
        qaId:'',
        val:'',
        text:'',
        sort:'',
      },
      // 表单校验
      addOptionRules: {},
      optionList: [], //选项列表
      currentOperate: '', //当前操作
      currentOptionId:null  //当前修改选项的ID值
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
    // 获取选项列表
    this.getOptionList();
  },
  methods: {
    // 获取选项列表
    getOptionList() {
      console.log('获取选项列表的参数：');
      console.log(this.queryParams);
      getOptionList(this.queryParams).then(res => {
        console.log('获取选项返回的数据：');
        console.log(res);
        this.optionList = res.data.records;
        this.total = res.data.total;
        this.$message.success('获取选项列表成功！');
        this.loading = false;
      });
    },

    // 搜索大题
    searchBigQuestion(){
      this.queryParams.qaId = this.searchValue
      this.getOptionList()
    },

    // searchBigQuestionById(){
    //   this.queryParams.id = this.byIdSearchValue
    //   this.getOptionList()
    // },

    // 关闭选项对话框
    closeOptionDialog(){
      this.open = false
      // 清空表单
      this.reset()
    },


    // 打开编辑问题对话框
    openEditOption(item) {
      this.title = '修改选项';
      // 改变当前操作变量
      this.currentOperate = 'edit';
      this.addOptionForm = {
        qaId:item.qaId,
        val:item.val,
        text:item.text,
        sort:item['sort'],
      };
      // 保存当前选项的id值
      this.currentOptionId = item.id
      //打开编辑选项对话框
      this.open = true;
    },

    //编辑问题对话框
    editOption() {
      let params = {
        ...this.addOptionForm,
        id:this.currentOptionId
      };
      console.log('编辑选项的参数：');
      console.log(params);
      editOption(params).then(res => {
        console.log('编辑选项返回的数据：');
        console.log(res);
        // 重置表单
        this.reset()
        // 关闭编辑选项对话框
        this.open = false;
        // 重置当前操作
        this.currentOperate = '';
        this.getOptionList()
      });
    },

    // 分页器每页大小改变时
    handleSizeChange(e) {
      console.log(e);
      this.queryParams.pageSize = e;
      this.getOptionList();
    },

    // 分页器改变页码时
    handleCurrentChange(e) {
      this.queryParams.pageIndex = e;
      this.getOptionList();
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
    // cancel() {
    //   this.open = false;
    //   this.addOptionForm = {
    //     qaId:'',
    //     val :'',
    //     text:'',
    //     sort:'',
    //   }
    // },

    // 表单重置
    reset() {
      this.addOptionForm = {
          qaId:'',
          val :'',
          text:'',
          sort:'',
        }
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
      this.title = '添加选项';
    },

    /** 提交按钮 */
    submitForm() {
      if (this.currentOperate === 'edit') {
        this.editOption();
        return;
      }
      // 添加选项
      let params = {
        qaId:this.addOptionForm.qaId.trim(),
        val:this.addOptionForm.val.trim(),
        text:this.addOptionForm.text.trim(),
        sort:this.addOptionForm['sort'].trim(),
      };
      console.log('添加大题时的参数：');
      console.log(params);
      addOption(params).then(res => {
        console.log('添加大题返回的数据：');
        console.log(res);
        this.$message.success('添加选项成功！');
        this.open = false;
        // 重置表单
        this.reset()
        // 刷新大题列表
        this.getOptionList();
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
    delOption(id) {
      this.$confirm('是否确认删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delOption(id);
        })
        .then(res => {
          console.log('删除选项返回的数据：');
          console.log(res);
          this.$message.success('删除成功！');
          this.getOptionList();
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
