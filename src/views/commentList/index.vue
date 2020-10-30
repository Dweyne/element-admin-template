<template>
  <div class="app-container">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据列表</span>
      </div>

      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

        <el-form-item label="评论id" prop="id">
          <el-input v-model="queryParams.id" placeholder="评论id" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>

        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>



      <el-table v-loading="loading" :data="ProductList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="评论id" width="130" align="center" prop="id" />
        <el-table-column label="被评论内容id" width="130" align="center" prop="categoryId" />
        <el-table-column label="评论内容" width="130" align="center" prop="commentContent" />
        <el-table-column label="被评论内容类型" align="center">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.category == 1">资源</span>
              <span v-if="scope.row.category == 2">悬赏</span>
              <span v-if="scope.row.category == 3">公告</span>
              <span v-if="scope.row.category == 4">评论</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="评论者id" width="130" align="center" prop="userId" />
        <el-table-column label="被评论者id" width="130" align="center" prop="pcommentUser" />


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
        <el-form-item label="评论id" prop="id">
          <span>{{form.id}}</span>
        </el-form-item>
        <el-form-item label="被评论内容id" prop="categoryId">
          <span>{{form.categoryId}}</span>
        </el-form-item>
        <el-form-item label="评论内容" width="130" align="center" prop="commentContent" />
          <span>{{form.commentContent}}</span>
        </el-form-item>
        <el-form-item label="被评论内容id" prop="categoryId">
          <template slot-scope="category">
            <div>
              <span v-if="form.category == 1">资源</span>
              <span v-if="form.category == 2">悬赏</span>
              <span v-if="form.category == 3">公告</span>
              <span v-if="form.category == 4">评论</span>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="评论者id" prop="userId">
          <span>{{form.userId}}</span>
        </el-form-item>
        <el-form-item label="被评论者id" prop="pcommentUser">
          <span>{{form.pcommentUser}}</span>
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
   commentList,
   commentInfo,
   commentDel
  } from "@/api/commentList/commentList.js";

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
    },
    methods: {

      /** 查询产品列表 */
      getList() {
        this.loading = true;
        console.log(this.queryParams)
        commentList(this.queryParams).then(response => {
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
        commentInfo(id).then(response => {
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
          return commentDel(id);
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
