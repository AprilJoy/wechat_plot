import * as echarts from '../../ec-canvas/echarts';

wx.cloud.init({
  env: 'test-d7368e'
})
const db = wx.cloud.database({})
const todos = db.collection('todos')
const todo = db.collection('todos').doc('W5i-W3no4LOC0Aql')

Page({
  data: {
    line: {

    },
    ec: {
      lazyLoad: true // 延迟加载
    }
  },

  onLoad: function (options) {
    this.echartsComponnet = this.selectComponent('#mychart');
    this.getData(); //获取数据   
  },
  getData: function () {
    var that = this
    db.collection('todos')
      .where({
        company: 'baidu'
      })
      .get({
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组
          var dic = {};
          var arr = [];
          var data = {};
          var re = res.data;
          for (var i = 0; i < re.length; i++) {
            dic[re[i]['season'] + '-' + re[i]['year']] = re[i]['earning']
          }
          console.log(dic);
          for (var year of ['2016', '2017']) {
            var xAxis = ['Q1', 'Q2', 'Q3', 'Q4']
            for (var i = 0; i < xAxis.length; i++) {
              var index = xAxis[i] + '-' + year
              if (index in dic) {
                if (dic[index] == null) {
                  arr.push(null)
                } else {
                  arr.push(dic[index])
                }
              }
              
            }
            data[year] = arr;
            arr = [];
          }
          console.log(data);
          that.data.line = data;
          try {
            that.init_echarts();//初始化图表
          } catch (e) {
            console.log(e)
          }
        }
      });

  },
  //初始化图表
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      chart.setOption(this.getOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  getOption: function () {
    var option = {
      title: {
        text: '百度营业收入',
        left: 'center'
      },
      color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
      legend: {
        data: ['2016', '2017'],
        top: 50,
        left: 'right',
        backgroundColor: 'white',
        z: 100
      },
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        confine: true,
        formatter: function (params) {
          var tip = '';
          for (var i = 0; i < params.length; i++) {
            tip += params[i].seriesName + '-' + params[i].name + ': ' + params[i].value;
            if (i != params.length - 1) {
              tip += '\n';
            }
          }
          return tip;
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Q1', 'Q2', 'Q3', 'Q4'],
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
        // show: false
      },
      series: [{
        name: '2016',
        type: 'line',
        smooth: true,
        data: this.data.line['2016']
      }, {
        name: '2017',
        type: 'line',
        smooth: true,
          data: this.data.line['2017']
      }]
    };
    return option;


  }
});
