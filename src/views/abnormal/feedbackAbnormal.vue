<template>
  <div class="app-container">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据列表</span>
      </div>

      <!-- <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

        <el-form-item label="用户名" prop="nickName">
          <el-input v-model="queryParams.nickName" placeholder="请输入用户名" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <template>
            <el-date-picker
                is-range
                v-model="queryParams.createTime"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                type="daterange"
                 @change="handleQuery" />
          </template>

        </el-form-item>


        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form> -->


      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="warning" size="mini" @click="getProductOut">导出用户数据</el-button>
        </el-col>
      </el-row>


      <el-table v-loading="loading" :data="ProductList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" width="130" align="center" prop="id" />
        <el-table-column label="反馈用户" width="130" align="center" prop="nikeName" />
        <el-table-column label="反馈用户头像" prop="avatar">
          <template slot-scope="scope">
            <img :src="scope.row.avatar" alt="点击打开" class="el-avatar" style="width: 30px;height: 30px;border-radius: 50%;">
          </template>
        </el-table-column>
        <el-table-column label="反馈内容" width="130" align="center" prop="opinionContent" />
        <el-table-column label="反馈内容图片" prop="opinionImg">
          <template slot-scope="scope">
            <img :src="itemImg" alt="点击打开" v-for="(itemImg,itemIndex) in scope.row.opinionImg" class="el-avatar" style="width: 30px;height: 30px;">
          </template>
        </el-table-column>
        <el-table-column label="联系方式" width="130" align="center" prop="contactWay" />
        <el-table-column label="创建时间" width="130" align="center" prop="createTime" />


        <el-table-column label="操作" width="200px" align="center" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-edit" @click="handleDetail(scope.row)">查看</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>1" :total="total" :page.sync="queryParams.pageIndex" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </el-card>
    <!-- 添加或修改商品分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" align="center">


      <el-form ref="form" :model="form" :rules="rules" label-width="100px">


        <el-form-item label="id" prop="id">
          <span>{{form.id}}</span>
        </el-form-item>
        <el-form-item label="反馈用户" prop="nikeName">
          <span>{{form.nikeName}}</span>
        </el-form-item>
        <el-form-item label="反馈用户头像" prop="avatar">
          <span>{{form.avatar}}</span>
          <template slot-scope="scope">
            <img :src="form.avatar" alt="点击打开" class="el-avatar" style="width: 30px;height: 30px;border-radius: 50%;">
          </template>
        </el-form-item>
        <el-form-item label="反馈内容" prop="opinionContent">
          <span>{{form.opinionContent}}</span>
        </el-form-item>
        <el-form-item label="反馈内容图片" prop="opinionImg">
          <template slot-scope="scope">
            <img :src="itemImg" alt="点击打开" v-for="(itemImg,itemIndex) in form.opinionImg" class="el-avatar" style="width: 30px;height: 30px">
          </template>
        </el-form-item>
        <el-form-item label="联系方式" prop="contactWay">
          <span>{{form.contactWay}}</span>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <span>{{form.createTime}}</span>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import {
   getFeedbackList,
   getFeedbackDetail,
   feedbackDel
  } from "@/api/feedback/feedback.js";
  import {
   getUserList,
   getUserAllList,
   getUserDetail
  } from "@/api/user/user.js";
  export default {
    data() {
      return {
        // 遮罩层
        loading: true,
        //上传的图片链接
        imageUrl: '',
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        showPdf: false,
        // 商品分类表格数据
        ProductList: [],
        permissionList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          "pageIndex": 1,
          "pageSize": 10
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {

        },
        ProductAllList: [],
        fileList:[],
        dialogUpload:false,
      };
    },
    created() {
      this.getList();
      // this.getAllList();
    },
    methods: {

      // 查询所有数据
      getAllList() {
        getUserAllList().then(response => {

          for(let i=0;i<response.data.records.length;i++){
            if(response.data.records[i].opinionImg=='[]'){
              response.data.records[i].opinionImg=[]
            }else{
              response.data.records[i].opinionImg=response.data.records[i].opinionImg.split('[')[1].split(']')[0].split(',')
            }
          }
          this.ProductAllList = response.data;
          console.log(this.ProductAllList)
        });
      },
      /** 查询产品列表 */
      getList() {
        this.loading = true;
        console.log(this.queryParams)
        getUserList(this.queryParams).then(response => {
          console.log(response)
          this.ProductList = response.data.records;
          this.total = parseInt(response.data.total);
          this.loading = false;
        });
      },

      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: 0,
          pdf: undefined
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageIndex= 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.typeId)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },

      /** 查看用户详情 */
      handleDetail(row) {
        this.reset();
        const id = row.id || this.ids
        getFeedbackDetail(id).then(response => {
          if(!!response.data.opinionImg){
            if(response.data.opinionImg=='[]'){
              response.data.opinionImg=[]
            }else{
              response.data.opinionImg=response.data.opinionImg.split('[')[1].split(']')[0].split(',')
            }
          }
          this.form = response.data;
          this.open = true;
          this.title = "用户详情";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.open = false
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const id = row.id || this.ids;
        this.$confirm('是否确认删除产品编号为"' + id + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return feedbackDel(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      //文件上传
      handleAvatarSuccess(res, file) {

        this.form.pdf = res.data;

      },

      beforeAvatarUpload(file) {
        const isLt50M = file.size / 1024 / 1024 < 50;
        if (!isLt50M) {
          this.$message.error('上传头像图片大小不能超过 50MB!');
        }
        return isLt50M;
      },


    }
  };
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block !important;
  }
  .el-upload{
    display: inline-block !important;
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
