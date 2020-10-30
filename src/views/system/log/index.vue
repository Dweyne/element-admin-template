<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="日志类型" prop="type">
          <el-select v-model="queryParams.type" placeholder="请选择" clearable size="small">
            <el-option label="系统管理" :value="0" />
            <el-option label="会员配置" :value="1" />
            <el-option label="模考大赛" :value="2" />
            <el-option label="系统消息" :value="3" />
            <el-option label="考试资讯" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作类型" prop="operationType">
          <el-select v-model="queryParams.operationType" placeholder="请选择" clearable size="small">
            <el-option label="创建" :value="1" />
            <el-option label="编辑" :value="2" />
            <el-option label="发布" :value="3" />
            <el-option label="撤回" :value="4" />
            <el-option label="删除" :value="5" />
            <el-option label="更改状态" :value="6" />
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间" prop="goodsName">
          <template>
            <div class="block">
              <el-date-picker
                v-model="time"
                type="datetimerange"
                @change="setTime"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </div>
          </template>
        </el-form-item>

        <el-form-item label>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div style="margin: 10px;"></div>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          <h3>系统操作日志</h3>
        </span>
        <span>
          <!-- <el-alert title="用于记录对商城用户的以及苹果的操作" type="success" center></el-alert> -->
        </span>
      </div>

      <el-row :gutter="10" class="mb8"></el-row>

      <el-table
        v-loading="loading"
        stripe
        :data="logList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="日志类型" width="150px" align="center" prop="type">
          <template slot-scope="scope">
            <span v-if="scope.row.type==0">系统管理</span>
            <span v-if="scope.row.type==1">会员配置</span>
            <span v-if="scope.row.type==2">模考大赛</span>
            <span v-if="scope.row.type==3">系统消息</span>
            <span v-if="scope.row.type==4">考试资讯</span>
          </template>
        </el-table-column>
        <el-table-column label="操作类型" align="center" prop="operationType">
          <template slot-scope="scope">
            <el-button round size="mini" type="primary" v-if="scope.row.operationType==1">创建</el-button>
            <el-button round size="mini" type="warning" v-if="scope.row.operationType==2">编辑</el-button>
            <el-button round size="mini" type="primary" v-if="scope.row.operationType==3">发布</el-button>
            <el-button round size="mini" type="danger" v-if="scope.row.operationType==4">撤回</el-button>
            <el-button round size="mini" type="danger" v-if="scope.row.operationType==5">删除</el-button>
            <el-button round size="mini" type="warning" v-if="scope.row.operationType==6">更改状态</el-button>
          </template>
        </el-table-column>

        <!-- <el-table-column label="内容" width="300px" align="center" prop="content" />
        <el-table-column label="IP地址" align="center" prop="ip" />-->
        <el-table-column label="操作人ID" align="center" prop="adminId" />
        <el-table-column label="操作用户名" align="center" prop="adminName" />
        <el-table-column label="描述" align="center" prop="description" />
        <el-table-column label="操作时间" align="center" prop="createTime" />
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script>
import { listSysLog } from "@/api/wgg/sys_log";

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
      logList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        startTime: "",
        endTime: "",
        pageSize: 10,
      },
      // 表单参数
      form: {},
      //时间选择器
      time: "",
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    resetQuery() {
      this.queryParams.type = "";
      this.queryParams.operationType = "";
      this.queryParams.userName = "";
      this.queryParams.startTime = "";
      this.queryParams.endTime = "";
    },
    setTime(value) {
      console.log(value)
      if (value == null) {
        this.queryParams.startTime = "";
        this.queryParams.endTime = "";
      } else{
        this.queryParams.startTime = this.time[0];
        this.queryParams.endTime = this.time[1];
      }
      this.getList()
    },
    /** 查询首页轮播图列表 */
    getList() {
      this.loading = true;
      listSysLog(this.queryParams).then((response) => {
        this.logList = response.data.list;
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
        path: undefined,
        url: undefined,
      };
      this.resetForm("form");
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // this.queryParams.pageSize = 1;
      this.getList();
    },
  },
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
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
