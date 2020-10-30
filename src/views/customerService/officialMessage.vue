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
      </el-form>
      <el-button type="primary" icon="el-icon-edit" @click="handleAllSend()">全部用户推送</el-button>

      <el-table v-loading="loading" :data="ProductList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="账号id" width="130" align="center" prop="id" />
        <el-table-column label="用户名" width="130" align="center" prop="nickName" />
        <el-table-column label="姓名" width="130" align="center" prop="name" />
        <el-table-column label="头像" prop="avatar">
          <template slot-scope="scope">
            <img :src="scope.row.avatar" alt="点击打开" class="el-avatar" style="width: 30px;height: 30px;border-radius: 50%;">
          </template>
        </el-table-column>
        <el-table-column label="电话" width="130" align="center" prop="phoneNumber" />
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


        <el-table-column label="操作" width="200px" align="center" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <!-- <el-button type="warning" icon="el-icon-edit" @click="handleDetail(scope.row)">查看</el-button> -->
            <el-button type="warning" icon="el-icon-edit" @click="handleSend(scope.row)">定点推送</el-button>

          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>1" :total="total" :page.sync="queryParams.pageIndex" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </el-card>
    <!-- 添加或修改商品分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" align="center">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="推送内容" prop="sendText">
          <el-input v-model="form.sendText" placeholder="请输入推送内容" />
        </el-form-item>

        <el-button type="primary" @click="submitForm">确 定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
   getUserList,
   getUserAllList,
   getUserDetail
  } from "@/api/user/user.js";
  import {
   sendMoreMessage,
   sendAllMessage
  } from "@/api/message/message.js";
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
        reciverIds:[],

        sendText:'',//推送内容
      };
    },
    created() {
      this.getList();
      this.getAllList();
    },
    methods: {
      handleAllSend(){
        this.reciverIds='';
        this.open=true;
        console.log('全部推送信息')
      },
      handleSend(e){
        this.reciverIds=e.id;
        this.open=true;
        console.log('发送信息')
      },
      //导出
      getProductOut() {
        import('@/vendor/Export2Excel').then(excel => {

          var orders = this.ProductAllList;
          var list = JSON.parse(JSON.stringify(orders));
          var listEver=this.ProductAllList[0];
          const tHeader = [
            	"ID","学习币","积分","累计小金库","总计充值学习币","累计获得积分","小金库","unionId",
              "openid"	,"用户昵称","姓名","个性签名","手机号","性别","头像","状态","版本","创建者",
              "创建日期","更新者","勋章","历史最高段位","更新日期","是否新用户","邀请码","父邀请码"
          ];
          const filterVal = [];
          for(let item in listEver){
              filterVal.push(item);
          }


          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "全部用户",
            autoWidth: "true",
            bookType: 'xlsx'
          })
        })
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
        getUserDetail(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "用户详情";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        var data={
          "userId":1,
          "nickName": "官方推送",
          "avatar": "http://test.wugeguozi.com/static/mine/aiOffical.png",
          "chatContent": this.form.sendText,
          "type": 1,
          "originator": 1,
          "chatListType": 1,
          "messageReceivers": []
        }
        if(this.reciverIds==''){
          console.log(data)
          sendAllMessage(data).then(response => {
            if(response.code==200){
              this.open=false
            }
          });
        }else{
          data.messageReceivers.push(this.reciverIds);
          sendMoreMessage(data).then(response => {
            if(response.code==200){
              this.open=false
            }
          });
        }
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
