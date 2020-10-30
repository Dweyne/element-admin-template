<template>
  <div class="dashboard-editor-container">

    <panel-group
      :allUser="allUser"
      :todayAu="todayAu"
      :todayUser="todayUser"
      :allOrder="allOrder"
      :allMoney="allMoney"
      @handleSetLineChartData="handleSetLineChartData"
    />

    <div id="userAddName" style="width: 100%;height: 350px;"></div>
    <div id="orderName" style="width: 100%;height: 350px;"></div>
    <!-- <line-chart :chartData="userAddNum" :className='userAddName'/>
    <line-chart :chartData="orderNews" :className='orderName'/> -->
  </div>
</template>

<script>
  // import echarts from 'echarts'
  // require('echarts/theme/macarons') // echarts theme
  import PanelGroup from './dashboard/PanelGroup'
  import LineChart from './dashboard/LineChart'
  import RaddarChart from './dashboard/RaddarChart'
  import PieChart from './dashboard/PieChart'
  import BarChart from './dashboard/BarChart'
  import {
    getAnalyze
  } from "@/api/wgg/sys_log";
  import {
    getInfo, getChartInfo
  } from "@/api/index/index.js";
  const lineChartData = {
    newVisitis: {
      expectedData: [100, 120, 161, 134, 105, 160, 165],
      actualData: [120, 82, 91, 154, 162, 140, 145]
    },
    messages: {
      expectedData: [200, 192, 120, 144, 160, 130, 140],
      actualData: [180, 160, 151, 106, 145, 150, 130]
    },
    purchases: {
      expectedData: [80, 100, 121, 104, 105, 90, 100],
      actualData: [120, 90, 100, 138, 142, 130, 130]
    },
    shoppings: {
      expectedData: [130, 140, 141, 142, 145, 150, 160],
      actualData: [120, 82, 91, 154, 162, 140, 130]
    }
  }

  export default {
    name: 'Index',
    components: {
      PanelGroup,
      LineChart,
      RaddarChart,
      PieChart,
      BarChart
    },
    data() {
      return {
        lineChartData: lineChartData.newVisitis,
        all: 0,
        today: 0,
        userAddNum: [],
        orderNews: [],
        chartUser: '',
        chartOrder: '',
        userAddName: '每日用户新增数量',
        orderName: '每日订单增加量',
        allMoney: 0, // 总收入
        allUser: 0, // 用户总人数
        todayUser: 0, // 今日用户增长量
        allOrder: 0, // 订单总数量
        todayAu: 0 // 今日活跃人数
      }
    },
    created() {
      this.getList();
      this.getChartList()
    },
    methods: {
      handleSetLineChartData(type) {

      },
      getList() {
        getInfo().then(response => {

          this.allMoney = response.data.totalRevenue;
          this.allUser = response.data.userNumbers;
          this.todayUser = response.data.userNewNumbers;
          this.allOrder = response.data.orderNumbers;
          this.todayAu = response.data.userActiveNumbers;

          // this.userAddNum = this.setChartsData(response.data.userInfo);
          // this.orderNews = this.setChartsData(response.data.orderInfo);
          // console.log(this.userAddNum);

          // this.chartUser = this.$echarts.init(document.getElementById('userAddName'));
          // var options = this.createChartNews(this.userAddNum,'userAddName');
          // this.chartUser.setOption(options)

          // // var chartUser = echarts.init(document.getElementById('userAddName'));

          // this.chartOrder = this.$echarts.init(document.getElementById('orderName'));
          // var options2=this.createChartNews(this.orderNews,'orderName');
          // this.chartOrder.setOption(options2);
        });
      },
      getChartList() {
        getChartInfo().then(res => {
          this.userAddNum = {date: res.data.dateTime, count: res.data.newUserNumbers}
          this.orderNews = {date: res.data.dateTime, count: res.data.totalOrderNumbers, money: res.data.totalAmount}
          
          this.chartUser = this.$echarts.init(document.getElementById('userAddName'));
          var options = this.createChartNews(this.userAddNum,'userAddName');
          this.chartUser.setOption(options)

          // var chartUser = echarts.init(document.getElementById('userAddName'));

          this.chartOrder = this.$echarts.init(document.getElementById('orderName'));
          var options2=this.createChartNews(this.orderNews,'orderName');
          this.chartOrder.setOption(options2)
        })
      },
      setChartsData(data) {
        var that = this;
        var xdata = {};
        for (let item in data[0]) {
          xdata[item] = [];
        }
        var lenge = [];
        for (let i = 0; i < data.length; i++) {
          for (let item in data[i]) {
            xdata[item].push(data[i][item]);
          }
        }
        return xdata
      },
      createChartNews(data,type) {
        var that = this;
        var lenge = [];
        for (let item in data) {
          if (item != 'date') {
            lenge.push(item);
          }
        }
        var seriesList = [];

        for (let item in data) {
          var series = {
            name: item,
            itemStyle: {},
            smooth: true,
            type: 'line',
            data: data[item],
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }
          seriesList.push(series);
        }
        if(type == 'userAddName'){
          var title='每日用户增加量'
        }else if(type == 'orderName'){
          var title='每日订单增加量'
        }
        var options = {
          title: {
            text: title
          },
          xAxis: {
            data: data['date'],
            boundaryGap: false,
            axisTick: {
              show: false
            },
            // axisLabel: {
            //   rotate: 30
            // }
          },
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 30,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            padding: [5, 10]
          },
          yAxis: {
            axisTick: {
              show: false
            }
          },
          legend: {
            data: lenge
          },
          series: seriesList
        }
        return options;
      },
      setOptions(data, type) {

        console.log(seriesList)
        if (type == 'userAddName') {
          console.log(this.chartUser)
          this.chartUser.setOption({
            title: {
              text: '每日用户增加量'
            },
            xAxis: {
              data: data['date'],
              boundaryGap: false,
              axisTick: {
                show: false
              },
              // axisLabel: {
              //   rotate: 30
              // }
            },
            grid: {
              left: 10,
              right: 10,
              bottom: 20,
              top: 30,
              containLabel: true
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              },
              padding: [5, 10]
            },
            yAxis: {
              axisTick: {
                show: false
              }
            },
            legend: {
              data: lenge
            },
            series: seriesList
          })
          console.log(this.chartUser)
        } else if (type == 'orderName') {
          this.chartOrder.setOption({
            title: {
              text: '每日订单量'
            },
            xAxis: {
              data: data['date'],
              boundaryGap: false,
              axisTick: {
                show: false
              },
              // axisLabel: {
              //   rotate: 30
              // }
            },
            grid: {
              left: 10,
              right: 10,
              bottom: 20,
              top: 30,
              containLabel: true
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              },
              padding: [5, 10]
            },
            yAxis: {
              axisTick: {
                show: false
              }
            },
            legend: {
              data: lenge
            },
            series: seriesList

          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
