<template>
  <div class="app-container">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据列表</span>
      </div>

      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

        <el-form-item label="用户名" prop="nickName">
          <el-input v-model="queryParams.nickName" placeholder="请输入用户名" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <template>
            <el-date-picker
                is-range
                v-model="createTime"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                type="daterange"
                 @change="handleQuery" />
          </template>

        </el-form-item>


        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>


      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="warning" size="mini" @click="exportOpen = true">导出用户数据</el-button>
        </el-col>
      </el-row>


      <el-table v-loading="loading" :data="ProductList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="账号id" width="130" align="center" prop="id" />
        <el-table-column label="用户名" width="130" align="center" prop="nickName" />
        <el-table-column label="姓名" width="130" align="center" prop="nickName" />
        <el-table-column label="头像" prop="avatar">
          <template slot-scope="scope">
            <img :src="scope.row.avatarUrl" alt="点击打开" class="el-avatar" style="width: 30px;height: 30px;border-radius: 50%;">
          </template>
        </el-table-column>
        <el-table-column label="电话" width="130" align="center" prop="phone" />
        <!-- <el-table-column label="角色" width="130" align="center" prop="" /> -->
        <!-- <el-table-column label="状态" width="130" align="center" prop="status" /> -->

        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.status === 1" style="cursor: pointer" :type="''">正常</el-tag>
              <el-tag v-else style="cursor: pointer" :type=" 'info' ">已冻结</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" width="130" align="center" prop="createTime" />


        <el-table-column label="操作" width="250px" align="center">
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-edit" @click="handleDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </el-card>
    <!-- 添加或修改商品分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" align="center">


      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="账号id" prop="id">
          <span>{{form.id}}</span>
        </el-form-item>
        <el-form-item label="用户名" prop="nickName">
          <span>{{form.nickName}}</span>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <span>{{form.nickName}}</span>
        </el-form-item>
        <el-form-item label="头像" prop="avatarUrl">
          <!-- <span>{{form.avatarUrl}}</span> -->
          <template>
            <img :src="form.avatarUrl" alt="点击打开" class="el-avatar" style="width: 30px;height: 30px;border-radius: 50%;">
          </template>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <span>{{form.phone}}</span>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <span>{{form.gender == 1 ? '男' : '女'}}</span>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <span>{{form.city}}</span>
        </el-form-item>
        <el-form-item label="状态" align="center">
              <el-tag v-if="form.status === 1" style="cursor: pointer" :type="''">正常</el-tag>
              <el-tag v-else style="cursor: pointer" :type=" 'info' ">已冻结</el-tag>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <span>{{form.createTime}}</span>
        </el-form-item>
        <el-form-item label="邀请码" prop="inviteCode">
          <span>{{form.inviteCode}}</span>
        </el-form-item>
        <el-form-item label="父邀请码" prop="writeCode">
          <span>{{form.writeCode == '0' ? '' : form.writeCode}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="导出" :visible.sync="exportOpen" width="500px" align="center" @close="exportClose">
      <el-form ref="form" :model="exportForm" label-width="100px">
        <el-form-item label="全部导出" prop="type">
          <el-radio-group v-model="exportForm.type">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="会员名" prop="name" v-if="!exportForm.type">
          <el-input v-model="exportForm.name"></el-input>
        </el-form-item>
        <el-form-item label="条数" prop="size" v-if="!exportForm.type">
          <el-input v-model="exportForm.size"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="getProductOut" :loading="exportLoading">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
   getUserList,
   getUserAllList,
   getUserDetail
  } from "@/api/user/user.js";
  import axios from 'axios';
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
          "pageNum": 1,
          "pageSize": 10,
          "startTime": '',
          "endTime": ''
        },
        createTime:'', // 创建时间
        // 表单参数
        form: {},
        // 表单校验
        rules: {

        },
        ProductAllList: [],
        fileList:[],
        dialogUpload:false,
        // 导出选项
        exportForm: {
          type: 1,
          name: '',
          size: ''
        },
        exportLoading: false,
        exportOpen: false,
      };
    },
    created() {
      this.getList();
      // this.getAllList();
    },
    watch:{
      createTime(val, oldVal){
        if(val){
          this.queryParams.startTime = val[0]
          this.queryParams.endTime = val[1]
        }else{
          this.queryParams.startTime = ''
          this.queryParams.endTime = ''
        }
      }
    },
    methods: {
      // 导出框关闭
      exportClose(){
        this.exportForm = {
          type: 1,
          name: '',
          size: ''
        }
      },
      //导出
      getProductOut() {
        let param = {
          type: this.exportForm.type,
          name: this.exportForm.type ? '' : this.exportForm.name,
          size: this.exportForm.type ? '' : this.exportForm.size
        }
        let url = process.env.VUE_APP_BASE_API + '/admin/user/export_list'
        this.exportLoading = true
        axios({
          url: url,
          method: 'get',
          params: param,
          responseType: 'blob',
          headers: {
            token: localStorage.getItem('token')
          }
        }).then(res => {
          this.exportLoading = false
          if(res.status == 200){
            var data = new Blob([res.data]);
            var file_name = '用户列表'
            // 通过a标签把内容下载到本地
            var obj = window.URL.createObjectURL(data);
            var a = document.createElement('a');
            a.download = `${file_name}.xls`;
            a.href = obj;
            a.click();
            // 下载完毕，释放
            a.onload = function(){
                window.URL.revokeObjectURL(obj);
            };
            this.msgSuccess("导出成功");
          }
          this.exportOpen = false
          console.log(res.data)
        })
        // import('@/vendor/Export2Excel').then(excel => {

        //   var orders = this.ProductAllList;
        //   var list = JSON.parse(JSON.stringify(orders));
        //   var listEver=this.ProductAllList[0];
        //   console.log(listEver);
        //   const tHeader = [
        //     	"ID","学习币","积分","累计小金库","总计充值学习币","累计获得积分","小金库","unionId",
        //       "openid"	,"用户昵称","姓名","个性签名","手机号","性别","头像","状态","版本","创建者",
        //       "创建日期","更新者","勋章","历史最高段位","更新日期","是否新用户","邀请码","父邀请码"
        //   ];

        //   const filterVal = [
        //       "id","learnCoin","intergral","totalSmall","totalLearn","totalIntegral",
        //       "smallCoin","unionId",'openId','nickName','name','sigmature',
        //       'phoneNumber','gender','avatar','status','version','createBy',
        //       'createTime','updateBy','ranks','maxRank','updateTime','newUser',
        //       'invitationNumber','parentInvitationNumber'
        //   ];
        //   const data = this.formatJson(filterVal, list)
        //   excel.export_json_to_excel({
        //     header: tHeader,
        //     data,
        //     filename: "全部用户",
        //     autoWidth: "true",
        //     bookType: 'xlsx'
        //   })
        // })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      //下载导入模板
      downloadModel() {
        window.location.href = 'https://sincere20.oss-cn-chengdu.aliyuncs.com/upload/202007291636371.xls'
      },
      //导入产品数据
      getProductIn() {

      },
      //文件上传前
      beforeModel(file){
        this.dialogUpload=true;
        console.log(file)
      },
      //文件上传成功
      handleSuccess(files, fileList) {
        this.getList();
      },
      // 查询所有数据
      getAllList() {
        getUserAllList().then(response => {
          console.log(response)
          this.ProductAllList = response.data;
        });
      },
      /** 查询产品列表 */
      getList() {
        this.loading = true;
        console.log(this.queryParams)
        getUserList(this.queryParams).then(response => {
          console.log(response)
          this.ProductList = response.data.list;
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
        this.queryParams.pageNum= 1;
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
        getUserDetail(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "订单详情";
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
          return delProduct(id);
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
