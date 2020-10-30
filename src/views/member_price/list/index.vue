<template>
  <div class="app-container">

 <el-card class="box-card">
   <div slot="header" class="clearfix">
     <span>数据列表</span>
   </div>

   <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
   </el-form>
   <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['/admin/member/create_or_update|POST']"
        >新增套餐</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="priceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" width="130" align="center" prop="id" />
      <el-table-column label="套餐名称" width="130" align="center" prop="packageContent" />
      <el-table-column label="价格" width="130" align="center" prop="amount" />
      <el-table-column label="会员有效期(天)" width="130" align="center" prop="serviceTime" />
      <el-table-column label="会员权益" width="130" align="center" prop="type">
        <template slot-scope="scope">
          <div>
            {{scope.row.type == 0 ? '全部' : ''}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center" prop="createTime" />
      <el-table-column label="详情" width="" align="center" prop="note" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['/admin/member/create_or_update|POST']"
          >修改</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['/admin/member/delete/*|GET']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>1"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />
 </el-card>
    <!-- 添加或修改商品分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" align="center">


      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-form-item label="套餐名称" prop="packageContent">
          <el-input v-model="form.packageContent" placeholder="" />
        </el-form-item>
        <el-form-item label="价格" prop="amount">
          <el-input v-model="form.amount" placeholder="" />
        </el-form-item>
        <el-form-item label="有效期(天)" prop="serviceTime">
          <el-input v-model="form.serviceTime" placeholder="" />
        </el-form-item>
        <el-form-item label="会员权益" prop="type">
          <el-select v-model="form.type" style="width:100%">
            <el-option :value="0" label="全部"></el-option>
          </el-select>
          <!-- <el-input v-model="form.type" placeholder="" /> -->
        </el-form-item>
        <el-form-item label="说明" prop="note">
          <el-input v-model="form.note" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, info, add, update, del } from "@/api/study/member_price";

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
      showPdf:false,
      // 商品分类表格数据
      priceList: [],

      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        	"pageNum": 1,
        	"pageSorts": [
        		{
        			"column": "",
        			"asc": true
        		}
        	],
        	"pageSize": 10
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        packageContent: [
          {required: true, message: '请输入名称',trigger: 'blur'}
        ],
        amount: [
          {required: true, message: '请输入价格',trigger: 'blur'}
        ],
        serviceTime: [
          {required: true, message: '请输入有效期',trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择权益',trigger: 'blur'}
        ],
      }
    };
  },
  created() {
    this.getList();

  },
  methods: {
    /** 查询产品列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then(response => {
        this.priceList = response.data;
        this.total = parseInt(response.data.length);
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
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
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
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增套餐";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = {...row}
      this.open = true;
      this.title = "修改套餐";
      // const id = row.id || this.ids
      // info(id).then(response => {
      //   this.form = response.data;
      //   this.open = true;
      //   this.title = "修改产品";
      // });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id) {
            update(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");

                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            add(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
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
          return del(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    //文件上传
    handleAvatarSuccess(res, file) {

    	 this.form.pdf=res.data;

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
