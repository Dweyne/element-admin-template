<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

        <el-form-item label="用户名" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入用户名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="queryParams.phone"
            placeholder="请输入手机号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="" >
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

    </el-card>
    <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>已处理留言列表</span>
              </div>
    <el-row :gutter="10" class="mb8">

    </el-row>

    <el-table v-loading="loading" stripe :data="messageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" width="50px" align="left" prop="id" />

      <el-table-column label="姓名" align="center" prop="name" />
       <el-table-column label="手机" align="center" prop="phone" />
      <el-table-column label="留言" align="center" prop="message" >
            <template slot-scope="scope">
                  <el-popover
                    placement="top-start"
                    title="留言详情"
                    width="500"
                    trigger="click"
                    :content="scope.row.message">
                    <el-button type="text" slot="reference">查看详情</el-button>
                  </el-popover>
            </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="标签" align="center" prop="tag" >
            <template slot-scope="scope">
                 <el-tag type="success">{{scope.row.tag}}</el-tag>
            </template>
          </el-table-column>
       <el-table-column label="状态" align="center" prop="status">
         <template slot-scope="scope">
              <el-button disabled round  size="mini" type="primary" v-if="scope.row.status==1" >待处理</el-button>
              <el-button disabled round  size="mini" type="success"v-if="scope.row.status==2" >已处理</el-button>
         </template>

       </el-table-column>
  <el-table-column label="创建时间" align="center" prop="createTime" />
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="handleSure(scope.row)"
          >操作</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />
  </el-card>
    <!-- 添加或修改首页轮播图对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" align="center">


      <div style="margin-top: 30px;"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" >
        <el-form-item label="标签" prop="tag">
             <el-radio-group v-model="form.tag">
                  <el-radio label="大客户"></el-radio>
                  <el-radio label="小客户"></el-radio>
             </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input   type="textarea"
          :rows="2"
          v-model="form.remark" placeholder="备注信息" />
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
import { listMessage,getMessage ,sure,deleteMessage} from "@/api/wgg/message";

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
      id:"",
      // 首页轮播图表格数据
      messageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams:{
        "status":2,
        "current": 1,
        "size": 10
      },

      // 表单参数
      form: {

      },
      // 表单校验
      rules: {
             }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询首页轮播图列表 */
    getList() {
      this.loading = true;
      listMessage(this.queryParams).then(response => {
        this.messageList = response.data.records;
        this.total =parseInt(response.data.total);
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
        tag:"",
        remark:"",
      };
      this.resetForm("form");
    },
   /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleSure(row) {
      this.reset();
      this.form.id = row.id;
      this.title = "处理客户【"+row.name+"】的留言";
      this.open = true;
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            console.log(this.form)
            sure(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("处理成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });

        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id ;
      this.$confirm('是否确认删除轮播图?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBanner(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }, 
    handleQuery(){
      this.queryParams.pageIndex = 1;
      this.getList();
      console.log(this.queryParams)

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
