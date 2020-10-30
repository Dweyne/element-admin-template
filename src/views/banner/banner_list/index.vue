<template>
  <div class="app-container">
 <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>数据列表</span>
              </div>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" stripe :data="bannerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" width="50px" align="left" prop="id" />
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
      </el-table-column>
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
       <el-form-item label="图片地址" prop="path">
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
        </el-form-item>

        <el-form-item label="跳转地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入跳转地址" />
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
import { listBanner,infoBanner ,addBanner,delBanner,updateBanner,deleteBanner} from "@/api/study/banner";

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
      bannerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams:{
       	"pageIndex": 1,
       	"pageSorts": [
       		{
       			"column": "",
       			"asc": false
       		}
       	],
       	"pageSize": 10

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
      listBanner(this.queryParams).then(response => {
        this.bannerList = response.data.records;
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
        img: undefined,
        url: undefined

      };
      this.resetForm("form");
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加首页轮播图";
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            console.log(this.form)
            addBanner(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.imageUrl='';
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
          return deleteBanner(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    //文件上传
    handleAvatarSuccess(res, file) {
           this.imageUrl = URL.createObjectURL(file.raw);
           console.log(res.data.url)
           this.form.img=res.data.url
         },

    beforeAvatarUpload(file) {

           const isLt10M = file.size / 1024 / 1024 < 10;
           if (!isLt10M) {
             this.$message.error('上传头像图片大小不能超过 10MB!');
           }
           return isLt10M;
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
