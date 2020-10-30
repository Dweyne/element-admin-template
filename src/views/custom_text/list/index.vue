<template>
  <div class="app-container">

<!--    <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>苹果兑换规则</span>
              </div>
               <span class="tl"> 自定义文案：</span>
               <span class="content">
                 {{custom.landouguize.content}}
               </span>
                    <br />
               <el-button
               type="primary"
               @click="handleUpdate(3)">修改</el-button>
    </el-card> -->

    <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>选择</span>
              </div>
               <span class="tl"> 自定义文案：</span>
               <span class="content">
                 {{custom.choose.content}}
               </span>
               <br />
               <div>
                 图片建议尺寸：
                 <span class="content">  1919px X 1419px</span>
                 <br />
                 <el-image style="width: 500px; height: auto;"
                  :src="custom.choose.img">
                 </el-image>
               </div>
               <br />
               <!-- <span class="tl"> 跳转地址：</span>
               <span >
                   {{custom.choose.url}}
               </span> -->
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               <el-button
               type="primary"
               @click="handleUpdate(1)">修改</el-button>
    </el-card>




    <!-- 添加或修改首页轮播图对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" align="center">


      <el-form ref="form" :model="form"  label-width="120px">
        <el-form-item v-if="form.title!=null" label="标题" prop="title">
            <el-input
            v-model="form.title" placeholder="请输入自定义内容" />
          </el-form-item>
        <el-form-item v-if="form.content!=null" label="自定义内容" prop="content">
          <el-input
          type="textarea"
          autosize
          v-model="form.content" placeholder="请输入自定义内容" />
        </el-form-item>

       <el-form-item label="图片" prop="img" v-if="form.img!=null">
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

        <el-form-item v-if="form.url!=null" label="跳转连接" prop="url">
          <el-input v-model="form.url" placeholder="请输入跳转连接" />
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
import { listCustom_text,getCustom_text,addCustom_text,updateCustom_text,getAll} from "@/api/wgg/custom_text";

export default {
  data() {
    return {
      // 遮罩层
      loading: true,

      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 数据内容
      custom:'',
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

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
      getAll().then(response => {
        this.custom = response.data;
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

    /** 修改按钮操作 */
    handleUpdate(id) {
      this.reset();
      getCustom_text(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改"+response.data.title;
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {

            updateCustom_text(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });

        }
      });
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
<style scoped="scoped">
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
  .tl{
    color: black;
    size: 20px;
  }
  .content{
    color: orchid;
    size: 20px;
  }
  .el-image__inner {
      vertical-align: top;
      height: auto;
      width: 200px;
  }
</style>
