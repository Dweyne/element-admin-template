<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据列表</span>
      </div>

      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>


      <!-- <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="warning" size="mini" @click="getProductOut">导出用户数据</el-button>
        </el-col>
      </el-row> -->


      <el-table v-loading="loading" :data="ProductList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="用户名" width="130" align="center" prop="nickName" /> -->
        <el-table-column label="用户id" width="130" align="center" prop="userId" />

        <el-table-column label="提现金额" width="130" align="center" prop="cashMoney" />
        <el-table-column label="提现方式" width="130" align="center" prop="cashType" />

        <el-table-column label="联系方式" width="130" align="center" prop="contact" />
        <el-table-column label="创建日期" width="130" align="center" prop="createTime" />

        <el-table-column label="提现状态" align="center">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.status === 1" style="cursor: pointer" :type="''">申请中</el-tag>
              <el-tag v-if="scope.row.status === 2" style="cursor: pointer" :type=" 'info' ">已提现</el-tag>
              <el-tag v-if="scope.row.status === 3" style="cursor: pointer" :type=" 'info' ">已拒绝</el-tag>
            </div>
          </template>
        </el-table-column>


        <el-table-column label="操作" width="200px" align="center" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-edit" @click="handleDetail(scope.row)">查看</el-button>
            <el-button type="primary" icon="el-icon-edit" @click="admitDetail(scope.row)" v-if="scope.row.status!=2">同意提现</el-button>
            <!-- <el-button type="danger" icon="el-icon-edit" @click="handleDetail(scope.row)">拒绝提现</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>1" :total="total" :page.sync="queryParams.pageIndex" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </el-card>
    <!-- 添加或修改商品分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" align="center">


      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户id" prop="id">
          <span>{{form.id}}</span>
        </el-form-item>
        <el-form-item label="提现金额" prop="cashMoney">
          <span>{{form.cashMoney}}</span>
        </el-form-item>
        <el-form-item label="提现方式" prop="cashType">
          <span>{{form.cashType}}</span>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <span>{{form.contact}}</span>
        </el-form-item>
        <el-form-item label="创建日期" prop="createTime">
          <span>{{form.createTime}}</span>
        </el-form-item>

        <el-form-item label="提现状态" align="center">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.status === 1" style="cursor: pointer" :type="''">申请中</el-tag>
              <el-tag v-if="scope.row.status === 2" style="cursor: pointer" :type=" 'info' ">已提现</el-tag>
              <el-tag v-if="scope.row.status === 3" style="cursor: pointer" :type=" 'info' ">已拒绝</el-tag>
            </div>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getWithdraList,getWithdraDetail ,WithdraNow} from "@/api/user/user.js";

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
      // 首页轮播图表格数据
      bannerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams:{
       	"pageIndex": 1,
       	"pageSize": 10
      },

      // 表单参数
      form: {

      },
      // 表单校验
      rules: {
      },
      ProductList:[]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //同意提现
    admitDetail(row){
      var id=row.id
      var data={
        "id":id
      }
      this.$confirm('是否确认同意提现?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return WithdraNow(data);
        }).then(() => {
          this.getList();
          this.msgSuccess("提现成功");
        }).catch(function() {});
    },
    handleQuery(){
      this.getList();
    },
    resetQuery(){
      this.queryParams={
       	"pageIndex": 1,
       	"pageSize": 10
      }
      this.getList();
    },
    submitForm(){
      this.open=false;
    },
    /** 查询提现列表列表 */
    getList() {
      this.loading = true;
      getWithdraList(this.queryParams).then(response => {
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
        img: undefined,
        url: undefined

      };
      this.resetForm("form");
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加首页轮播图";
    },
    /** 查看用户详情 */
    handleDetail(row) {
      this.reset();
      const id = row.id || this.ids
      getWithdraDetail(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "用户详情";
      });
    },

    //文件上传
    handleAvatarSuccess(res, file) {
           this.imageUrl = URL.createObjectURL(file.raw);
           console.log(res.data.url)
           this.form.img=res.data.url
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
<style>
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
