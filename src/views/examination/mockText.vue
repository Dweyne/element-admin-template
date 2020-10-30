<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix"><span>模考大赛</span></div>

      <!-- 增删改查按钮开始 -->
      <el-row :gutter="10" class="mb8 flex_center">
        <el-col :span="1.5"><el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button></el-col>
        <el-col :span="10">
          <div class="flex_center">
            <el-input placeholder="请输入内容" v-model="searchValue"></el-input>
            <el-button type="primary" @click="searchMock">搜索</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 增删改查按钮结束 -->

      <!-- 模考列表开始 -->
      <el-table v-loading="loading" stripe :data="mockList" border>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="id" label="模考ID" width="80"></el-table-column>
        <el-table-column prop="courseSyllabusId" label="试卷ID" width="180"></el-table-column>
        <el-table-column prop="name" label="模考名称" width="180"></el-table-column>
        <el-table-column prop="examTime" label="模考时长(分钟)" width="180"></el-table-column>
        <el-table-column prop="planStartTime" label="模考时间" width="180"></el-table-column>
        <el-table-column prop="planEndTime" label="结束时间" width="180"></el-table-column>
        <el-table-column prop="resultReleaseTime" label="公布时间" width="180"></el-table-column>
        <el-table-column label="模考类型" width="180">
          <template slot-scope="scope">
            {{ scope.row.mode === 'mock' ? '普通模考' : '活动模考' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            {{ getMockStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="success" @click="openEditMockDialog(scope.row)">修改</el-button>
            <el-button type="danger" @click="delMock(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <!-- <el-table-column label="主键" width="50px" align="left" prop="id" />
        <el-table-column label="图片" align="center" width="220" prop="img" >
          <template slot-scope="scope">
            <el-image
            style="width: 200px; height: auto ; border-radius: 5px;"
            :src="scope.row.img">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="跳转连接" align="center" prop="url" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">

            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>

          </template>
        </el-table-column> -->
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pageIndex"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageIndex"
        :limit.sync="queryParams.size"
      /> -->
      <!-- 模考列表结束 -->
    </el-card>

    <!-- 添加或修改首页轮播图对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" align="center">
      <div style="margin-top: 30px;"></div>
      <!-- 添加模考表单开始 -->
      <el-form ref="addMockFormRef" :model="addMockForm" :rules="addMockFormRules" label-width="150px">
        <!-- <el-form-item label="图片地址" prop="path">
          <el-upload
            class="avatar-uploader"
            action="http://test.wrxkj.com/upload/uploadToOss"
            :show-file-list="false"
            name="multipartFile"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.img" :src="form.img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
        <!-- <el-form-item label="考试名称" prop="examName">
          <el-input v-model="addMockForm.mockName"></el-input>
        </el-form-item> -->
        <el-form-item label="考试时长(分钟)" prop="duration"><el-input v-model="addMockForm.duration"></el-input></el-form-item>
        <el-form-item label="考试时间" prop="name">
          <el-date-picker v-model="addMockForm.startTime" type="datetime" placeholder="选择日期时间" default-value="2020-09-01" default-time="00:00:00"></el-date-picker>
        </el-form-item>
        <el-form-item label="公告时间" prop="name">
          <el-date-picker v-model="addMockForm.publishTime" type="datetime" placeholder="选择日期时间" default-value="2020-09-03" default-time="00:00:00"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="name">
          <el-date-picker v-model="addMockForm.overTime" type="datetime" placeholder="选择日期时间" default-value="2020-09-03" default-time="00:00:00"></el-date-picker>
        </el-form-item>
        <el-form-item label="试卷ID" prop="name"><el-input v-model="addMockForm.papersId"></el-input></el-form-item>
        <el-form-item label="模考类型" prop="name">
          <el-select v-model="addMockForm.mockType" placeholder="请选择">
            <el-option v-for="(item, index) in mockType" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="模考状态" prop="name">
          <el-select v-model="addMockForm.mockStatus" placeholder="请选择">
            <el-option
              v-for="(item, index) in mockStatus"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <!-- 添加模考表单结束 -->

      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addMock, getMockList, editMock, delMock } from '@/api/exam/index.js';

export default {
  data() {
    return {
      // 搜索内容
      searchValue:'',
      // 模考列表
      mockList: [],
      // 模考类型
      mockType: [
        {
          value: 'mock',
          label: '普通模考'
        },
        {
          value: 'mockSpecial',
          label: '活动模考'
        }
      ],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 模考总条数
      total: 0,
      // 首页轮播图表格数据
      bannerList: [],
      // 弹出层标题
      title: '',
      // 是否显示dialog
      open: false,
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSorts: [
          {
            column: '',
            asc: true
          }
        ],
        pageSize: 10,
        name:''
      },

      // 表单参数
      addMockForm: {
        // mockName:'',
        duration: 0,
        startTime: 0,
        publishTime: 0,
        overTime: 0,
        papersId: 0,
        mockType: ''
      },

      // 表单校验
      addMockFormRules: {},
      currentOperate: '', //当前的操作
      currentEditId: 0 //'当前修改模考信息的ID'
    };
  },

  computed: {
    getMockStatus(status) {
      return status => {
        if (status === 0) {
          return '待对战';
        } else if (status === 10) {
          return '对战中';
        } else if (status === 15) {
          return '待公布';
        } else {
          return '完成';
        }
      };
    }
  },

  created() {
    // 获取模考列表数据
    this.getMockList();
  },

  methods: {

    // 搜索内容
    searchMock(){
      this.queryParams.name = this.searchValue
      let params = {
        ...this.queryParams,
        mode: '1v1'
      };
      console.log('获取模考列表的参数：');
      console.log(params);
      getMockList(params).then(res => {
        console.log('获取模考列表返回的数据：');
        console.log(res);
        this.total = res.data.total;
        this.mockList = res.data.records;
        this.$message.success('列表加载成功！');
        this.loading = false;
      });
    },

    // 分页器每页大小改变时
    handleSizeChange(e) {
      console.log(e);
      this.queryParams.pageSize = e;
      this.getMockList();
    },

    // 分页器改变页码时
    handleCurrentChange(e) {
      this.queryParams.pageIndex = e;
      this.getMockList();
    },

    // 获取模考列表数据
    getMockList() {
      let params = {
        ...this.queryParams,
        mode: '1v1'
      };
      console.log('获取模考列表的参数：');
      console.log(params);
      getMockList(params).then(res => {
        console.log('获取模考列表返回的数据：');
        console.log(res);
        this.total = res.data.total;
        this.mockList = res.data.records;
        this.$message.success('列表加载成功！');
        this.loading = false;
      });
    },

    // 打开修改模考信息对话框
    openEditMockDialog(item) {
      this.title = '修改模考信息';
      // 显示原来的数据
      this.addMockForm = {
        duration: item.examTime,
        startTime: item.planStartTime,
        publishTime: item.resultReleaseTime,
        overTime: item.planEndTime,
        papersId: item.courseSyllabusId,
        mockType: item.mode
      };
      // 打开模考编辑对话框
      this.open = true;
      // 修改当前操作的状态
      this.currentOperate = 'edit';
      this.currentEditId = item.id;
    },

    // 编辑模考信息
    editMock() {
      // 收集修改模考信息参数
      let params = {
        mode: this.addMockForm.mockType,
        examTime: this.addMockForm.duration,
        planStartTime: this.addMockForm.startTime,
        courseSyllabusId: this.addMockForm.papersId,
        planEndTime: this.addMockForm.overTime,
        resultReleaseTime: this.addMockForm.publishTime,
        status: 0,
        id: this.currentEditId
      };
      console.log('编辑模考的参数：');
      console.log(params);
      // 进行修改模考信息请求
      editMock(params).then(res => {
        console.log('编辑模考返回的数据：');
        console.log(res);
        if (res.code === 200) {
          this.$message.success('编辑模考成功！');
          // 更新模考列表
          this.getMockList();
        }
        this.currentOperate = '';
        this.open = false;
      });
    },

    // 删除模考信息
    delMock(id) {
      console.log('删除模考前的参数：');
      console.log(id);
      delMock(id).then(res => {
        console.log('删除模考信息返回的数据：');
        console.log(res);
        if (res.code === 200) {
          this.$message.success('删除成功！');
          // 更新模考列表
          this.getMockList();
        }
      });
    },

    /** 查询首页轮播图列表 */
    // getList() {
    //   this.loading = true;
    //   listBanner(this.queryParams).then(response => {
    //     this.bannerList = response.data.records;
    //     this.total = parseInt(response.data.total);
    //     this.loading = false;
    //   });
    // },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.addMockForm = {
        // mockName:'',
        duration: 0,
        startTime: 0,
        publishTime: 0,
        overTime: 0,
        papersId: 0,
        mockType: '',
        mockStatus: ''
      };
      this.resetForm('addMockForm');
    },

    // 多选框选中数据
    // handleSelectionChange(selection) {
    //   this.ids = selection.map(item => item.id)
    //   this.single = selection.length!=1
    //   this.multiple = !selection.length
    // },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加模考';
      this.currentOperate = 'add'
    },

    /** 提交按钮 */
    submitForm() {
      // 如果当前操作为编辑那么编辑模考信息
      if (this.currentOperate === 'edit') {
        this.editMock();
        return;
      }
      let params = {
        mode: this.addMockForm.mockType,
        examTime: this.addMockForm.duration,
        planStartTime: this.addMockForm.startTime,
        courseSyllabusId: this.addMockForm.papersId,
        planEndTime: this.addMockForm.overTime,
        resultReleaseTime: this.addMockForm.publishTime,
        status: 0
      };
      console.log('添加模考前的参数：');
      console.log(params);
      addMock(params).then(res => {
        console.log('添加模考返回的数据：');
        console.log(res);
        this.$message.success('添加模考成功！');
        this.open = false;
        // 更新模考列表
        this.getMockList();
      });
      // this.$refs["form"].validate(valid => {
      //   if (valid) {
      //       console.log(this.form)
      //       addBanner(this.form).then(response => {
      //         if (response.code === 200) {
      //           this.msgSuccess("新增成功");
      //           this.open = false;
      //           this.imageUrl='';
      //           this.getList();
      //         } else {
      //           this.msgError(response.msg);
      //         }
      //       });

      //   }
      // });
    }
    /** 删除按钮操作 */
    // handleDelete(row) {
    //   const id = row.id ;
    //   this.$confirm('是否确认删除轮播图?', "警告", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }).then(function() {
    //       return deleteBanner(id);
    //     }).then(() => {
    //       this.getList();
    //       this.msgSuccess("删除成功");
    //     }).catch(function() {});
    // },
    //文件上传
    // handleAvatarSuccess(res, file) {
    //        this.imageUrl = URL.createObjectURL(file.raw);
    //        console.log(res.data.url)
    //        this.form.img=res.data.url
    //      },

    // beforeAvatarUpload(file) {

    //        const isLt10M = file.size / 1024 / 1024 < 10;
    //        if (!isLt10M) {
    //          this.$message.error('上传头像图片大小不能超过 10MB!');
    //        }
    //        return isLt10M;
    //      }
  }
};
</script>
<style scoped>
.flex_center{
  display: flex;
  align-items: center;
}
  .el-pagination{
    margin-top: 50px;
  }
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
