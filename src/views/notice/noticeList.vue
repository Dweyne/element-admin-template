<template>
  <div class="app-container">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据列表</span>
      </div>

      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="queryParams.title" placeholder="请输入系统消息标题" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!-- <el-form-item label="省份" prop="province">
          <el-select v-model="queryParams.province" placeholder="请选择省份" @change="provinceChange">
              <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-select v-model="queryParams.province" placeholder="请选择省份" @change="provinceChange">
              <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-select v-model="queryParams.city" placeholder="请选择城市(先选择省份才能选城市)" @change='$forceUpdate()'>
              <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
        </el-form-item> -->

        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>


      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['/admin/message/create|POST']">新增消息</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="ProductList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="消息id" width="130" align="center" prop="id" />

        <el-table-column label="消息标题" width="150" align="center" prop="title" />
        <el-table-column label="发布时间" align="center" prop="updateTime" />
        <el-table-column label="阅读量" width="130" align="center" prop="pageView" />
        <el-table-column label="发布人" width="130" align="center" prop="releaseName" />
        <el-table-column label="状态" width="130" align="center" prop="isRelease">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.isRelease === 0" style="cursor: pointer" :type="'info'">未发布</el-tag>
              <el-tag v-else style="cursor: pointer" :type=" '' ">已发布</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="接收用户" width="130" align="center" prop="endTime" >
          <template slot-scope="scope">
            <div>{{ scope.row.acceptUser === 0 ? '全部' : '' }}</div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="250px" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" :disabled="Boolean(scope.row.isRelease)" v-hasPermi="['/admin/message/update|POST']">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['/admin/message/delete/*|GET']">删除</el-button>
            <el-button type="text" icon="el-icon-upload" @click="realeaseMessage(scope.row)" v-if="scope.row.isRelease == 0" v-hasPermi="['/admin/message/release/*|GET']">发布</el-button>
            <el-button type="text" @click="withdraw(scope.row)" v-else v-hasPermi="['/admin/message/back/*|GET']">撤回</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </el-card>
    <!-- 置顶 -->
    <el-dialog :title="releaseDialogTitle" :visible.sync="open2" width="450px" align="center">

      <div slot="footer" class="dialog-footer" align="center">

        <el-button type="primary" @click="release">确 定</el-button>
        <el-button @click="cancelOpen">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 添加或修改公告分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" align="center">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" >
        <el-form-item label="消息标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入公告标题" />
        </el-form-item>
        <!-- <el-form-item label="报考人数" prop="applyNumber">
          <el-input v-model="form.applyNumber" placeholder="请输入报考人数" type="text" name="tel" oninput = "value=value.replace(/[^\d]/g,'')"/>
        </el-form-item>

        <el-form-item label="报名开始时间">
          <template>
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              placeholder="选择日期时间"
            />
          </template>
        </el-form-item>
        <el-form-item label="报名结束时间">
          <template>
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="选择日期时间"
            />
          </template>
        </el-form-item>

        <el-form-item label="省份" prop="province">
          <el-select v-model="form.province" placeholder="请选择省份" @change='provinceChange'>
              <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="城市" prop="city">
          <el-select v-model="form.city" placeholder="请选择城市(先选择省份才能选城市)" @change='$forceUpdate()'>
              <el-option
                v-for="(item,index) in cityList"
                :key="index"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="考试类型" prop="examinationType">
          <el-select v-model="form.examinationType" placeholder="请选择考试类型">
              <el-option
                v-for="(item,index) in courseList"
                :key="index"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="报名方式" prop="registrationWay">
          <el-input v-model="form.registrationWay" placeholder="请输入报名方式" />
        </el-form-item>

        <el-form-item label="报名链接" prop="registrationLink">
          <el-input v-model="form.registrationLink" placeholder="请输入报名链接" />
        </el-form-item> -->
        <el-form-item label="内容详情" prop="content" style="padding-bottom:50px">
          <editor v-model="form.content" placeholder="内容详情" />
          <!-- <el-input type="textarea" rows="6" v-model="form.noticeContent" placeholder="内容详情" ></el-input> -->
        </el-form-item>
        
        <!-- <el-form-item label="内容详情" prop="content" style="padding-bottom:50px">
          <el-input type="textarea" v-model="form.content" rows="10"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">

        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import {
    getNoticeList,
    getNoticeDetail,
    addNotice,
    getProvince,
    updateNotice,
    delNotice,
    getWithdraw,
    getRelease,
    setTopNow
  } from "@/api/notice/notice.js";
  import editor from '../../components/Editor'
  export default {
    components: { editor },
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
          title: [
            {required: true, message: '请输入标题', change: 'blur'}
          ],
          content: [
            {required: true, message: '请输入内容', change: 'blur'}
          ]
        },
        ProductAllList: [],
        fileList:[],
        dialogUpload:false,
        provinceList:[],
        provinceId:'',
        cityList:[],
        cityStatus:false,
        courseList:[],//一级类型
        open2:false,
        topId:'',//选择公告id
        releaseDialogTitle: '是否将消息发布',
        releaseStatus: true, // 是否已发布
      };
    },
    created() {
      this.getList();
      // this.getCourseType();
      // this.getAllList();
    },
    methods: {
      //发布消息
      realeaseMessage(e){
        this.releaseStatus = false
        this.releaseDialogTitle = '是否将消息发布'
        this.topId=e.id;
        this.open2=true;
      },

      /**撤回消息 */
      withdraw(e){
        this.releaseStatus = true
        this.releaseDialogTitle = '是否将消息撤回'
        this.topId=e.id;
        this.open2=true;
      },

      /* 发布/撤回 */
      release(){
        if(this.releaseStatus){
          getWithdraw(this.topId).then(res=>{
            this.msgSuccess("撤回成功");
            this.getList()
          })
        } else {
          getRelease(this.topId).then(res=>{
            this.msgSuccess("发布成功");
            this.getList()
          })
        }
        this.open2=false;
      },

      cancelOpen(){
        this.open2=false
      },
      //获取课程
      getCourseType(){

        getType().then(res=>{
         this.courseList=res.data
        })
      },

      getProvince(){
        var data={
          "type":1
        }
        getProvince(data).then(response => {
          this.provinceList = response.data;
          this.loading = false;
        });
      },
      getCity(id){
        var data={
          "type":2,
          "id":id
        }
        getProvince(data).then(response => {
          this.cityList = response.data;
          this.form.city=this.cityList[0].name
        });
      },
      provinceChange(e){
        console.log(this.form.province);
        for(let i=0;i<this.provinceList.length;i++){
          if(e==this.provinceList[i].name){
            this.getCity(this.provinceList[i].id)
          }
        }
      },
      // // 查询所有数据
      // getAllList() {
      //   listAllProduct().then(response => {
      //     console.log(response)
      //     this.ProductAllList = response.data;
      //   });
      // },
      /** 查询产品列表 */
      getList() {
        this.loading = true;
        // if(!!this.queryParams.province){
        //   this.queryParams.province=this.provinceList[this.queryParams.province].name
        // }
        console.log(this.queryParams);
        getNoticeList(this.queryParams).then(response => {
          this.ProductList = response.data.list;
          this.total = parseInt(response.data.total);
          this.loading = false
          // this.getProvince();
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
          pid: 2,
          // pdf: undefined
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
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增消息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getNoticeDetail(id).then(response => {
          response.data.noticeContent=this.set_rich(response.data.noticeContent);
          this.form = response.data;
          this.open = true;
          this.title = "修改消息";
        });
      },
      set_rich: function(e) {
      	if (e == null) {
      		return
      	}
      	// e = e.replace(/&lt;/g, '<');
      	// e = e.replace(/&gt;/g, '>');
      	e = e.replace(/&quot;/g, '"');
      	e = e.replace(/&amp;/g, ' ');

      	// e = e.replace(/lt;/g, '<');
      	// e = e.replace(/gt;/g, '>');
      	e = e.replace(/quot;/g, '"');
      	e = e.replace(/amp;/g, ' ');

      	e = e.replace(/img/g, "img style='width:100%;height:auto'");
      	e = e.replace(/<p>/g, "<p style='width:100%;height:auto'>");
      	return e
      },
      /** 提交按钮 */
      submitForm: function() {
        console.log(this.$refs["form"])
        this.$refs["form"].validate(valid => {
          if (valid) {
            Object.assign(this.form, {pid: 2})
            if (this.form.id) {
              console.log(this.form)
              // this.form.city=this.cityList[this.form.city].name
              updateNotice(this.form).then(response => {
                console.log(response)
                if (response.code === 200) {
                  this.msgSuccess("修改成功");

                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {

              console.log('新增')
              console.log(this.form)
              // this.form.city=this.cityList[this.form.city].name
              addNotice(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.data.msg);
                }
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const id = row.id || this.ids;
        this.$confirm('是否确认删除公告编号为"' + id + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delNotice(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
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
