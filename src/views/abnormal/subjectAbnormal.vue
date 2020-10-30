<template>
  <div class="app-container">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据列表</span>
      </div>
      
      <el-row :gutter="20">
        <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      </el-row>
      
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">


        <!-- <el-form-item label="异常类型" prop="type">
          <el-select v-model="queryParams.type" placeholder="请选择异常类型" @change="handleQuery">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
          </el-select>
        </el-form-item> -->


       <!-- <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item> -->
        
      </el-form>
      <el-table v-loading="loading" :data="ProductList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" width="130" align="center" prop="id" />
        <el-table-column label="异常类型" width="130" align="center" prop="type" >
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">评论异常</span>
            <span v-if="scope.row.type==2">资源异常</span>
            <span v-if="scope.row.type==3">悬赏异常</span>
            <span v-if="scope.row.type==4">题目异常</span>
          </template>

        </el-table-column>
        <el-table-column label="被举报内容id" width="130" align="center" prop="businessId" />
        <el-table-column label="举报发起人" width="130" align="center" prop="userId" />
        <el-table-column label="举报描述" width="130" align="center" prop="reportDescription" />
        <el-table-column label="被举报用户id" width="130" align="center" prop="reportUserId" />
        <el-table-column label="关键字" width="130" align="center" prop="keyword" />
        <el-form-item label="举报截图" prop="image">
          <template slot-scope="scope">
            <img :src="itemImg" alt="点击打开" v-for="(itemImg,itemIndex) in scope.row.image" class="el-avatar" style="width: 30px;height: 30px;">
          </template>
        </el-form-item>
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
        <el-table-column label="举报人" width="130" align="center" prop="userId" />
        <el-table-column label="举报描述" width="130" align="center" prop="reportUserId" />
        <el-table-column label="被举报内容id" width="130" align="center" prop="businessId" />
        <el-table-column label="关键字" width="130" align="center" prop="keyword" />
        <el-form-item label="举报截图" prop="image">
          <template slot-scope="scope">
            <img :src="itemImg" alt="点击打开" v-for="(itemImg,itemIndex) in scope.row.image" class="el-avatar" style="width: 30px;height: 30px;">
          </template>
        </el-form-item>
        <el-table-column label="创建时间" width="130" align="center" prop="createTime" />

        <el-form-item label="id" prop="id">
          <span>{{form.id}}</span>
        </el-form-item>
        <el-form-item label="异常类型" prop="nikeName">
          <span v-if="form.type==1">评论异常</span>
          <span v-if="form.type==2">资源异常</span>
          <span v-if="form.type==3">悬赏异常</span>
          <span v-if="form.type==4">题目异常</span>
        </el-form-item>
        <el-form-item label="举报发起人id" prop="userId">
          <span>{{form.userId}}</span>
        </el-form-item>
        <el-form-item label="举报描述" prop="reportDescription">
          <span>{{form.reportDescription}}</span>
        </el-form-item>
        <el-form-item label="被举报用户id" prop="reportUserId">
          <span>{{form.reportUserId}}</span>
        </el-form-item>
        <el-form-item label="关键字" prop="keyword">
          <span>{{form.keyword}}</span>
        </el-form-item>
        <el-form-item label="举报截图" prop="image">
          <template slot-scope="scope">
            <img :src="itemImg" alt="点击打开" v-for="(itemImg,itemIndex) in form.image" class="el-avatar" style="width: 30px;height: 30px;border-radius: 50%;">
          </template>
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
   abnormalList,
   abnormalInfo,
   abnormalDel,
  } from "@/api/commentAbnormal/commentAbnormal.js";

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
          "pageSize": 10,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {

        },
        ProductAllList: [],
        fileList:[],
        dialogUpload:false
      };
    },
    created() {
      this.getList();
      // this.getAllList();
    },
    methods: {
      typeChange(){
        this.getList();
      },
      /** 查询产品列表 */
      getList() {
        this.loading = true;
        console.log(this.queryParams)
        abnormalList(this.queryParams).then(response => {
          console.log(response)

          for(let i=0;i<response.data.records.length;i++){
            if(!!response.data.records[i].image){
              if(response.data.records[i].image=='[]'){
                response.data.records[i].image=[]
              }else{
                response.data.records[i].image=response.data.records[i].image.split('[')[1].split(']')[0].split(',')
              }
            }
          }
          this.ProductList = response.data.records;
          console.log(this.ProductList);
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
      // handleQuery() {
      //   console.log(this.queryParams);
      //   this.queryParams.pageIndex= 1;
      //   this.getList();
      // },
      /** 重置按钮操作 */
      // resetQuery() {
      //   this.resetForm("queryForm");
      //   this.handleQuery();
      // },
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
        abnormalInfo(id).then(response => {
          if(!!response.data.image){
            if(response.data.image=='[]'){
              response.data.image=[]
            }else{
              response.data.image=response.data.image.split('[')[1].split(']')[0].split(',')
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
          return abnormalDel(id);
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
