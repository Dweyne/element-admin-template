<template>
  <div class="app-container">

 <el-card class="box-card">
   <div slot="header" class="clearfix">
     <span>数据列表</span>
   </div>

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

      <el-form-item label="资源id" prop="id">
        <el-input v-model="queryParams.id" placeholder="请输入资源id" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>



      <el-form-item label="">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>


    </el-form>

    <el-table v-loading="loading" :data="priceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" width="130" align="center" prop="id" />
      <el-table-column label="用户id" width="130" align="center" prop="userId" />
      <el-table-column label="昵称" width="130" align="center" prop="name" />
      <el-table-column label="头像" prop="avatar">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt="点击打开" class="el-avatar" style="width: 30px;height: 30px;border-radius: 50%;">
        </template>
      </el-table-column>
      <el-table-column label="圈子id" width="130" align="center" prop="circleId" />
      <el-table-column label="奖励金额" width="130" align="center" prop="resourceAmount" />
      <el-table-column label="标题" width="130" align="center" prop="title" />
      <el-table-column label="内容" width="130" align="center" prop="content" />
      <el-table-column label="是否发布(2为已发布)" width="130" align="center" prop="releaseOffer" />
      <el-table-column label="图片" prop="image">
        <template slot-scope="scope">
          <img :src="item" alt="点击打开" class="el-avatar" v-for="(item,index) in scope.row.image" style="width: 30px;height: 30px;">
        </template>
      </el-table-column>
      <el-table-column label="最佳回复ID" prop="bestAnswerId" width="130" align="center"/>
      <el-table-column label="排序" prop="rank" width="130" align="center"/>
      <el-table-column label="浏览量" width="130" align="center" prop="viewNumber" />
      <el-table-column label="总回复数量" width="130" align="center" prop="answerNumber" />
      <el-table-column label="点赞人数" width="130" align="center" prop="likeNum" />
      <el-table-column label="评论人数" width="130" align="center" prop="commentNum" />
     <el-table-column label="创建时间" width="130" align="center" prop="createTime" />
      <el-table-column label="操作" width="200px" align="center"  fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >查看</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"

          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>1"
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />
 </el-card>
    <!-- 查看详情 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" align="center">


      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="id" prop="id">
          <el-input v-model="form.id" placeholder="" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="form.name" placeholder="" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
            <img :src="form.avatar" alt="点击打开" class="el-avatar" style="width: 30px;height: 30px;border-radius: 50%;">
        </el-form-item>
        <el-form-item label="圈子id" prop="circleId">
          <el-input v-model="form.circleId" placeholder="" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="奖励金额" prop="resourceAmount">
          <el-input v-model="form.resourceAmount" placeholder="" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" placeholder="" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="是否发布(2为已发布)" prop="releaseOffer">
          <el-input v-model="form.releaseOffer" placeholder="" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <img :src="item" class="el-avatar" v-for="(item,index) in form.image" style="width: 30px;height: 30px;">
        </el-form-item>
        <el-form-item label="最佳回复ID" prop="bestAnswerId">
          <el-input v-model="form.bestAnswerId" placeholder="" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="排序" prop="rank">
          <el-input v-model="form.rank" placeholder="" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="浏览量" prop="viewNumber">
          <el-input v-model="form.viewNumber" placeholder="" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="总回复数量" prop="answerNumber">
          <el-input v-model="form.answerNumber" placeholder="" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="点赞人数" prop="likeNum">
          <el-input v-model="form.likeNum" placeholder="" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="评论人数" prop="commentNum">
          <el-input v-model="form.commentNum" placeholder="" disabled="disabled"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="cancel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { resourceList,resourceInfo,resourceDel } from "@/api/resource/resource";

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
        	"pageIndex": 1,
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
      resourceList(this.queryParams).then(response => {

        for(let i=0;i<response.data.records.length;i++){
          if(response.data.records[i].image=='[]'){
          	var imgList=[]
          }else{
          	var imgList=response.data.records[i].image.split('[')[1].split(']')[0].split(',');
          }
          response.data.records[i].image=imgList;
        }

        this.priceList = response.data.records;
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
        pdf:undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1;
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
      this.title = "新增产品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      resourceInfo(id).then(response => {
        if(response.data.image=='[]'){
        	var imgList=[]
        }else{
        	var imgList=response.data.image.split('[')[1].split(']')[0].split(',');
        }
        response.data.image=imgList;
        this.form = response.data;
        this.open = true;
        this.title = "修改产品";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != 0) {
            resourceUpdate(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");

                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            resourceAdd(this.form).then(response => {
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
      this.$confirm('是否确认删除套餐编号为"' + id + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return resourceDel(id);
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
