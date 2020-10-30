<template>
  <div class="app-container">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据列表</span>
      </div>

      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="支付状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择支付状态" @change="handleQuery" clearable>
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单号" prop="orderNumber">
          <el-input v-model="queryParams.orderNumber" placeholder="请输入订单号" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!-- <el-form-item label="订单日期" prop="createTime">
          <template>
            <el-date-picker
              v-model="queryParams.createTime"
              type="datetime"
              placeholder="选择日期时间"
              @change="handleQuery"
            />
          </template>
        </el-form-item> -->


        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>


      <!-- 订单详细 -->
      <el-dialog :title="title" :visible.sync="open2" width="900px" align="center">
         <el-input v-model="refuseReson" placeholder="请输入拒绝理由" />
        <div slot="footer" class="dialog-footer" align="center">
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>

      <el-table v-loading="loading" :data="ProductList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column label="订单id" width="130" align="center" prop="id" />
        <el-table-column label="订单编号" width="160" align="center" prop="orderNumber" />
        <!-- <el-table-column label="微信支付流水单号" width="130" align="center" prop="wxTradeNo" /> -->
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.status === 0" style="cursor: pointer" :type="'info'">未付款</el-tag>
              <el-tag v-if="scope.row.status === 1" style="cursor: pointer" :type="''">已支付</el-tag>
              <el-tag v-if="scope.row.status === 2" style="cursor: pointer" :type="'info'">已取消</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="130" align="center" prop="userNickname" />
        <el-table-column label="头像" prop="avatarUrl">
          <template slot-scope="scope">
            <img :src="scope.row.avatarUrl" alt="点击打开" class="el-avatar" style="width: 30px;height: 30px;border-radius: 50%;">
          </template>
        </el-table-column>

        <el-table-column label="订单信息" width="130" align="center" prop="note" />
        <el-table-column label="订单总价" width="130" align="center" prop="totalAmount" />
        <el-table-column label="实际支付金额" width="130" align="center" prop="totalAmount" >
          <template slot-scope="scope">
            <div>
              {{scope.row.status == 1 ? scope.row.totalAmount : 0}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="购买数量" width="130" align="center" prop="number" />
        <!-- <el-table-column label="异常订单" width="130" align="center" prop="abnormal" /> -->
        <!-- <el-table-column label="角色" width="130" align="center" prop="" /> -->
        <!-- <el-table-column label="状态" width="130" align="center" prop="status" /> -->



        <el-table-column label="创建时间" width="160" align="center" prop="createTime" />


        <el-table-column label="操作" width="200px" align="center" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-edit" @click="handleDetail(scope.row)">查看</el-button>
            <el-button type="primary" icon="el-icon-edit" @click="agree(scope.row)" v-if="scope.row.status==4">同意售后</el-button>
            <el-button type="danger" icon="el-icon-edit" @click="refuse(scope.row)" v-if="scope.row.status==4">拒绝售后</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>1" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </el-card>

        <!-- 添加或修改商品分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" align="center">


      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="订单id" prop="id">
          <span>{{form.id}}</span>
        </el-form-item>
        <el-form-item label="订单编号" prop="orderNumber">
          <span>{{form.orderNumber}}</span>
        </el-form-item>
        <el-form-item label="流水单号" prop="orderNumber">
          <span>{{form.orderNumber}}</span>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <!-- <span>{{form.avatarUrl}}</span> -->
          <template>
            <div>
              <el-tag v-if="form.status === 0" style="cursor: pointer" :type="'info'">未付款</el-tag>
              <el-tag v-if="form.status === 1" style="cursor: pointer" :type="''">已支付</el-tag>
              <el-tag v-if="form.status === 2" style="cursor: pointer" :type="'info'">已取消</el-tag>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="用户名" prop="userNickname">
          <span>{{form.userNickname}}</span>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <span>{{form.phone}}</span>
        </el-form-item>
        <el-form-item label="订单信息" prop="note">
          <span>{{form.note}}</span>
        </el-form-item>
        <el-form-item label="订单总价" align="totalAmount">
          <span>{{form.totalAmount}}</span>
        </el-form-item>
        <el-form-item label="实付金额" prop="totalAmount">
          <span>{{form.status == 1 ? form.totalAmount : 0}}</span>
        </el-form-item>
        <el-form-item label="订单数量" prop="number">
          <span>{{form.number}}</span>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <span>{{form.createTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="cancel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
   getOrderList,
   getOrderDetail,
   delOrder,
   agreeRefund,
   refusedRefund
  } from "@/api/order/order.js";

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
        refuseId:'',//拒绝提现id
        refuseReson:'',//拒绝理由
        open2:false,
        statusList:[
          {
            id: 0,
            name: '未付款'
          },
          {
            id: 1,
            name:'已支付'
          },
          {
            id: 2,
            name:'已取消'
          },
          // {
          //   id:'3',
          //   name:'已收货'
          // },
          // {
          //   id:'4',
          //   name:'售后中'
          // },
          // {
          //   id:'5',
          //   name:'已退款'
          // },
          // {
          //   id:'6',
          //   name:'拒绝退款'
          // },
        ]
      };
    },
    created() {
      this.getList();
      // this.getAllList();
    },
    methods: {
      //同意售后
      agree(row){
        var id=row.id;
        var data=
          {
          	"id": id,
          	"remark": ""
          }
        this.$confirm('是否确认同意售后?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return agreeRefund(data);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      //拒绝售后
      refuse(row){
        var id=row.id;
        this.refuseId=id;
        this.open2=true
      },
      //导出
      getProductOut() {
        import('@/vendor/Export2Excel').then(excel => {

          var orders = this.ProductAllList;
          var list = JSON.parse(JSON.stringify(orders));
          var listEver=this.ProductAllList[0];
          const tHeader = [
            	"ID","学习币","积分","累计小金库","总计充值学习币","累计获得积分","小金库","unionId",
              "openid"	,"订单昵称","姓名","个性签名","手机号","性别","头像","状态","版本","创建者",
              "创建日期","更新者","勋章","历史最高段位","更新日期","是否新订单","邀请码","父邀请码"
          ];
          const filterVal = [];
          for(let item in listEver){
              filterVal.push(item);
          }


          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "全部订单",
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
        getOrderList(this.queryParams).then(response => {
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

      /** 查看订单详情 */
      handleDetail(row) {
        this.reset();
        const id = row.id || this.ids
        getOrderDetail(id).then(response => {
          console.log(response);
          this.form = response.data;
          this.open = true;
          this.title = "订单详情";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        var data={
          "id":this.refuseId,
          "remark": this.refuseReson
        }
        console.log(data)
        refusedRefund(data).then(response => {
          console.log(response);
          this.msgSuccess("拒绝成功");
          this.getList();
          this.open2 = false
        });

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
