<template>
  <div class="app-container">
    <el-row :gutter="20">
     <!-- <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />用户名称
                <div class="pull-right">{{ user.userName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />手机号码
                <div class="pull-right">{{ user.phonenumber }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />所属部门
                <div class="pull-right" v-if="user.dept">{{ user.dept.deptName }} / {{ postGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />所属角色
                <div class="pull-right">{{ roleGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />创建日期
                <div class="pull-right">2018-08-23 09:11:56</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col> -->
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>用户操作</span>
          </div>
          <el-tabs v-model="activeTab">

            <el-tab-pane label="修改密码" name="resetPwd">
              <!-- <resetPwd :user="user" /> -->
              <el-form ref="form" :model="userNew" :rules="rules" label-width="80px">
                <el-form-item label="旧密码" prop="oldPassword">
                  <el-input v-model="userNew.oldPassword" placeholder="请输入旧密码" type="password" />
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input v-model="userNew.newPassword" placeholder="请输入新密码" type="password" />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input v-model="userNew.confirmPassword" placeholder="请确认密码" type="password" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="submit">保存</el-button>
                  <el-button type="danger" size="mini" @click="close">关闭</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
       <!--       <el-tab-pane label="基本资料" name="userinfo">
                          <userInfo :user="user" />
               </el-tab-pane> -->
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserInfo } from "@/api/system/user";
import { modifyPassword} from "@/api/system/user";
export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.userNew.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "resetPwd",
      test: "1test",
      userNew: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // this.getUser();
  },
  methods: {
    submit() {
      var that=this
      console.log('asdsada')
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log(that.user)
          // that.userNew.userId=that.user.id
          modifyPassword(that.userNew).then(
            response => {
              if (response.code === 200) {
                that.msgSuccess("修改成功");
                this.$store.dispatch("tagsView/delView", this.$route);
                this.$router.push({ path: "/index" });
              } else {
                that.msgError(response.msg);
              }
            }
          );
        }
      });
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/index" });
    },
    getUser() {
      getUserInfo().then(response => {
        this.user = response.data;
      });
    }
  }
};
</script>
