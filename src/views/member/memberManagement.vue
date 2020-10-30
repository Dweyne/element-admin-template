<template>
  <div class="app-container">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据列表</span>
      </div>

      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

        <el-form-item label="会员名" prop="nickName">
          <el-input v-model="queryParams.nickName" placeholder="请输入会员名称" clearable size="small" @keyup.enter.native="handleQuery" />
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
        <el-table-column label="头像" prop="avatarUrl">
          <template slot-scope="scope">
            <img :src="scope.row.avatarUrl" alt="点击打开" class="el-avatar" style="width: 30px;height: 30px;border-radius: 50%;">
          </template>
          
        </el-table-column>
        <!-- <el-table-column label="姓名" width="130" align="center" prop="name" />

        <el-table-column label="电话" width="130" align="center" prop="phoneNumber" /> -->
        <el-table-column label="会员权益" width="130" align="center" prop="type">
          <template slot-scope="scope">
            <span>{{ scope.row.type == 0 ? '全部' : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="会员到期时间" width="160" align="center" prop="endTime" />
        <el-table-column label="会员邀请次数" width="130" align="center" prop="inviteNumber" />
        
        <!-- <el-table-column label="会员赠送悬赏置顶次数" width="130" align="center" prop="giftRewardTopNumber" />
        <el-table-column label="会员赠送资源置顶次数" width="130" align="center" prop="giftResourceTopNumber" />

        <el-table-column label="悬赏置顶次数" width="130" align="center" prop="rewardTopNumber" />
        <el-table-column label="资源置顶次数" width="130" align="center" prop="resourceTopNumber" /> -->

        <!-- <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.status === 1" style="cursor: pointer" :type="''">正常</el-tag>
              <el-tag v-else style="cursor: pointer" :type=" 'info' ">已冻结</el-tag>
            </div>
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="创建时间" width="130" align="center" prop="createTime" /> -->


        <el-table-column label="操作" width="200px" align="center">
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
        <el-form-item label="用户id" prop="id">
          <span>{{form.id}}</span>
        </el-form-item>
        <el-form-item label="用户名" prop="nickName">
          <span>{{form.nickName}}</span>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <span v-if="form.gender == 1">男</span>
          <span v-if="form.gender == 2">女</span>
          <span v-if="form.gender == 0">未知</span>
        </el-form-item>
        <el-form-item label="微信号" prop="giftResourceTopNumber">
          <span>{{form.giftResourceTopNumber}}</span>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <span>{{form.phone}}</span>
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <span>{{form.country}}</span>
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <span>{{form.province}}</span>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <span>{{form.city}}</span>
        </el-form-item>
        <el-form-item label="会员权益" align="center">
            <div>
              {{form.type == 0 ? '全部' : ''}}
            </div>
        </el-form-item>
        <el-form-item label="会员到期时间" prop="endTime">
          <span>{{form.endTime}}</span>
        </el-form-item>
        <el-form-item label="会员邀请次数" prop="inviteNumber">
          <span>{{form.inviteNumber}}</span>
        </el-form-item>
        <el-form-item label="邀请码" prop="inviteCode">
          <span>{{form.inviteCode}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 导出 -->
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
   getMemberList,
   getMemberDetail,
   exportMember
  } from "@/api/member/member.js";
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
        let url = process.env.VUE_APP_BASE_API + '/admin/member/export/user_list'
        // window.open(url)
        // console.log(url)
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
            var file_name = '会员列表'
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
        // exportMember(param).then((res) => {
        //   console.log(res)
        // })
        // import('@/vendor/Export2Excel').then(excel => {

        //   var orders = this.ProductAllList;
        //   var list = JSON.parse(JSON.stringify(orders));
        //   var listEver=this.ProductAllList[0];
        //   const tHeader = [
        //     	"账号id","用户名","头像","会员权益","会员到期时间", "会员邀请次数"
        //   ];
        //   const filterVal = [];
        //   for(let item in listEver){
        //       filterVal.push(item);
        //   }


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
      // getAllList() {
      //   getUserAllList().then(response => {
      //     console.log(response)
      //     this.ProductAllList = response.data;
      //   });
      // },
      /** 查询产品列表 */
      getList() {
        this.loading = true;
        console.log(this.queryParams)
        getMemberList(this.queryParams).then(response => {
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
        getMemberDetail(id).then(response => {
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
