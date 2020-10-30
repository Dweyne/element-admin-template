<template>
  <div class="app-container">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据列表</span>
      </div>

      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

        <el-form-item label="订单号" prop="orderNumber">
          <el-input v-model="queryParams.orderNumber" placeholder="请输入订单号" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="订单日期" prop="createTime">
          <template>
            <el-date-picker v-model="queryParams.createTime" type="datetime" placeholder="选择日期时间" @change="handleQuery" />
          </template>
        </el-form-item>


        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>



      <div class="allCommunication">
        <div class="communicateEara">
          <div class="newsList" ref="chatMain" id="newsList" style="width: 100%;height: 30vh;border:1px solid;overflow: scroll;">
            <div class="talkEver" v-for="(talkItem,index) in talkList" :key='index'>
              <div class="talkMine" v-if="talkItem.identityType==1">
                <div class="talkMineHead">
                  <img class="talkHeadImg" :src="talkItem['avatar']"></img>
                </div>
                <div class="talkMineText" v-if="talkItem.type==1">
                  {{talkItem.chatContent}}
                </div>
                <img class="talkMineImg" @click="openImgDetail(talkItem['chatContent'])" :src="talkItem['chatContent']"
                  v-if="talkItem.type==2" mode="widthFix">

                </img>

                <div class="talkMineSoundRecording" v-if="talkItem.type==3" @click="soundingAction(talkItem['chatContent'],index)">
                  <!-- <div class="soundingTime">{{talkItem.soundingTime}}</div> -->
                  <div class="soundingTime">...</div>
                  <img class="talkMineSoundImg" :src="resoure_URL('circle/play.png')" v-if="!talkItem['playStatus']"></img>
                  <img class="talkMineSoundImg" :src="resoure_URL('circle/stop.png')" v-else></img>

                </div>


                <video :src="talkItem['chatContent']" object-fit='contain' class="talkMineVideo" v-if="talkItem.type==4">
                </video>
              </div>
              <div class="talkOther" v-else="talkItem.identityType==2">
                <div class="reportSign">
                </div>
                <div class="talkOtherHead" @click="goOther(talkItem['userId'])">
                  <img class="talkHeadImg" :src="talkItem['avatar']"></img>
                </div>
                <div class="talkOtherText" v-if="talkItem.type==1">
                  {{talkItem.chatContent}}
                </div>
                <img class="talkOtherImg" :src="talkItem['chatContent']" v-if="talkItem.type==2" mode="widthFix">

                </img>
                <div class="talkOtherSoundRecording" v-if="talkItem.type==3" @click="soundingAction(talkItem['chatContent'],index)">
                  <!-- <div class="soundingTime">{{talkItem.soundingTime}}</div> -->
                  <div class="soundingTime">...</div>
                  <img class="talkOtherSoundImg" :src="resoure_URL('circle/play.png')" v-if="!talkItem['playStatus']"></img>
                  <img class="talkOtherSoundImg" :src="resoure_URL('circle/stop.png')" v-else></img>
                </div>
                <video :src="talkItem['chatContent']" object-fit='contain' class="talkOtherVideo" v-if="talkItem.type==4">
                </video>
              </div>
            </div>
          </div>
          <div class="newsInput">
            <textarea class="inputTextRecording" v-model="inputText" style="width: 100%;height: 20vh;border: 1px solid;">

            </textarea>
          </div>
          <div class="inputNow" @click="sendSocketMessageNow(inputText,1)">
            发送
          </div>
        </div>
        <div>
          <el-table v-loading="loading" :data="ProductList" @row-click="handleRowChange" @selection-change="handleSelectionChange" style="width: 96%;margin-left: 3%;">
            <el-table-column label="消息id" width="130" align="center" prop="id" />
            <el-table-column label="用户名称" width="130" align="center" prop="name" />
            <el-table-column label="头像" prop="avatar">
              <template slot-scope="scope">
                <img :src="scope.row.avatar" alt="点击打开" class="el-avatar" style="width: 30px;height: 30px;border-radius: 50%;">
              </template>
            </el-table-column>


          </el-table>
          <pagination v-show="total>1" :total="total" :page.sync="queryParams.pageIndex" :limit.sync="queryParams.pageSize"
            @pagination="getList" />
        </div>



      </div>

    </el-card>
  </div>
</template>

<script>
  import {
    // getUserList,
    getNewsList,
    getHead
  } from "@/api/message/message.js";
  import {
   getUserList,
   getUserAllList,
   getUserDetail
  } from "@/api/user/user.js";
  export default {
    data() {
      return {
        // 遮罩层
        loading: true,
        //上传的图片链接
        imgUrl: '',
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
          "pageIndex": 1,
          "pageSize": 10
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {

        },
        ProductAllList: [],
        fileList: [],
        dialogUpload: false,
        inputText: '', //输入内容
        talkList: [], //交流列表
        websock: null, //websocket
        userData:{},
        otherId:'',//当前交流用户id
      };
    },
    created() {
      this.initWebSocket();
      this.getList();
      this.getHeadNews();
    },
    methods: {
      //聊天框处于最底部
      makeBottom(){
        console.log('asdasdasdasdassa');
        // var div=document.getElementById('newsList')
        // // var div = document.getElementsByClassName('newsList')
        // console.log(div[0].scrollTop)
        // console.log(div[0].scrollHeight)
        // div[0].scrollTop = div[0].scrollHeight;
        this.$refs.chatMain.scrollTop = this.$refs.chatMain.scrollHeight
            // 监听window的resize事件
        window.onresize = () => {
          this.$refs.chatMain.scrollTop = this.$refs.chatMain.scrollHeight
        }
      },

      handleRowChange(row, event, column){
        this.otherId=row.id;
        this.getMessageList(row.id)
      },

      getHeadNews(){
        var data={
          "id":2
        }
        getHead(data).then(response => {
          console.log(response)
          this.userData=response.data;
          console.log(this.userData)
        });
      },
      //初始化链接websocket
      initWebSocket() {
        const wsuri = "ws://192.168.0.206:8088/wx/socket/2";
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },
      //发送信息
      sendSocketMessageNow(msg, type) {
      	var that = this;
      	if (msg == '') {
      		return;
      	}
      	var data = {
      		//用户ID
      		'userId':2,
      		//用户昵称
      		'nickName': this.userData.nickName,
      		//头像
      		'avatar': this.userData.avatar,
      		//聊天内容
      		'chatContent': msg,
      		//消息类型
      		'type': type,
      		//发起者id
      		'originator': 2,
      		//接受者id
      		'messageReceiver': this.otherId,
      	}
      	var newsEver = {
      		'userId': this.userData.id,
      		'avatar': this.userData.avatar,
      		'identityType': 1,
      		'type': type,
      		'chatContent': msg,
      		'playStatus': false,
      		'soundingTime': ''
      	}
      	console.log(data)
      	data = JSON.stringify(data);

        that.talkList.push(newsEver);
        this.inputText='';
        this.makeBottom();
      	this.websocketsend(data);
      },
      websocketonopen() { //连接建立之后执行send方法发送数据
        console.log('连接成功');
        // var data = {
        // 	//用户ID
        // 	'userId':2,
        // 	//用户昵称
        // 	'nickName': '客服',
        // 	//头像
        // 	'avatar': '',
        // 	//聊天内容
        // 	'chatContent': '喵喵喵喵喵喵喵喵喵喵',
        // 	//消息类型
        // 	'type': 1,
        // 	//发起者id
        // 	'originator': 2,
        // 	//接受者id
        // 	'messageReceiver': 19,
        // }
        // data = JSON.stringify(data);
        // this.websocketsend(data);
      },
      websocketonerror() { //连接建立失败重连
        this.initWebSocket();
      },
      websocketonmessage(e) { //数据接收
        console.log(e);
        var otherEver = JSON.parse(e.data);
        var that = this;

        otherEver.identityType = 2;
        otherEver.playStatus = false;

        otherEver.soundingTime = '';
        that.talkList.push(otherEver);
        setTimeout(function() {
        	that.makeBottom();
        }, 1000)
        console.log('监听到服务器消息:');
        console.log(e);

      },
      websocketsend(Data) { //数据发送
        this.websock.send(Data);
        console.log('发送成功')
      },
      websocketclose(e) { //关闭
        console.log('断开连接', e);
      },
      // 查询所有数据
      getAllList() {
        getUserAllList().then(response => {
          this.ProductAllList = response.data;
        });
      },
      /** 查询用户消息列表 */
      getList() {
        this.loading = true;
        // var data = {
        //   id: 2
        // }
       getUserList(this.queryParams).then(response => {
         console.log(response)
         this.ProductList = response.data.records;
         this.total = parseInt(response.data.total);
         this.loading = false;
       });
      },
      //获取对应用户信息列表
      getMessageList(id) {
        var data = {
          "userId": 2,
          "messageReceiver":id
        }
        console.log(data)
        getNewsList(data).then(response => {
          console.log(response)
          for (let i = 0; i < response.data.length; i++) {
            // response.data[i].playStatus = false;
            if (response.data[i].userId == 2) {
              response.data[i].identityType = 1;
            } else {
              response.data[i].identityType = 2;
            }
          }

          this.talkList = response.data;
          this.makeBottom();
          console.log("消息列表")
          console.log(this.talkList)
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
        this.single = selection.length != 1
        this.multiple = !selection.length
      },

      /** 查看订单详情 */
      handleDetail(row) {
        this.reset();
        const id = row.id || this.ids
        getOrderDetail(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "订单详情";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.open = false
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
  .allCommunication {
    display: flex;
    width: 100%;
  }
  .communicateEara{
    width: 48%;
  }
  .talkEver {
    width: 100%;
    height: auto;
    float: left;
  }
  .talkOtherHead{
    float: left;
    width: 40px;
    height: 40px;
    border-radius: 30px;
    margin-top: 20px;
    margin-left: 7%;
  }
  .talkMineHead {
    float: right;
    width: 40px;
    height: 40px;
    border-radius: 30px;
    margin-top: 20px;
    margin-right: 7%;

  }
  .talkHeadImg {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .talkOtherText{
    float: left;
        max-width: 40%;
        padding: 13px;
        line-height: 30px;
        border-radius: 25px;
        box-shadow: 0px -5px 10px rgba(0, 0, 0, .15);
        margin-left: 2%;
        font-size: 10px;
        margin: 0 auto;
  }
  .talkMineText {
    float: right;
        max-width: 40%;
        padding: 13px;
        line-height: 30px;
        border-radius: 25px;
        box-shadow: 0px -5px 10px rgba(0, 0, 0, .15);
        margin-left: 2%;
        font-size: 10px;
        margin: 0 auto;
  }
  .talkMineImg {
    width: 30%;
    float: right;
    margin-right: 2%;
    border-radius: 0%;
    background: white;
  }
  .talkMine {
    float: right;
    width: 100%;
    min-height: 100px;
    margin-top: 60px;
    height: auto;
  }
  .talkMineVideo {
    width: 50%;
    float: right;
    margin-right: 2%;
    border-radius: 0%;
    height: 28.125vw;
    background: white;
  }

  .talkMineSoundRecording {
    width: 30%;
    float: right;
    margin-right: 2%;
    border-radius: 0%;
    border-radius: 25px;
    box-shadow: 0px -5px 10px rgba(0, 0, 0, .15);
    margin-top: 23px;
    background: white;

  }

  .talkMineSoundImg {
    width: 40px;
    height: 40px;
    float: left;
    padding-left: 10%;
    margin-top: 9px;

  }

  .soundingTime {
    float: right;
    line-height: 14px;
    margin-right: 28%;
    font-size: 75px;


  }
  .talkMineHead {
    float: right;
    width: 40px;
    height: 40px;
    border-radius: 30px;
    margin-top: 20px;
    margin-left: 7%;


  }
  .talkHeadImg {
    border-radius: 50%;
  }
  .talkOther {
    float: left;
    width: 100%;
    min-height: 100px;
    margin-top: 60px;
    height: auto;
  }

  .talkOtherImg{
    width: 30%;
    float: left;
    margin-left: 2%;
    border-radius: 0%;
  }

  .talkMineImg {
    width: 30%;
    float: left;
    margin-left: 2%;
    border-radius: 0%;
  }

  .talkMineVideo {
    width: 50%;
    float: left;
    margin-left: 2%;
    border-radius: 0%;
    height: 28.125vw;
  }

  .talkMineSoundRecording {
    width: 30%;
    float: left;
    margin-left: 2%;
    border-radius: 0%;
    border-radius: 25px;
    box-shadow: 0px -5px 10px rgba(0, 0, 0, .15);
    margin-top: 23px;

  }
  .talkMineSoundImg {
    width: 40px;
    height: 40px;
    float: left;
    padding-left: 10%;
    margin-top: 9px;

  }

  .soundingTime {
    float: right;
    line-height: 14px;
    margin-right: 28%;
    font-size: 75px;

  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block !important;
  }

  .el-upload {
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
