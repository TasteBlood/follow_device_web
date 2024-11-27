const myChart = echarts.init(document.getElementById('myChart'));
let index,layer;
layui.use('layer',()=>{
    layer = layui.layer;
    index = layer.load(3)
})
$.ajax({
    url: 'hospital/api/statistics',
    type: 'GET',
    success: function (res) {
        // 基于准备好的dom，初始化echarts实例
        layer.close(index)
        let data = res.data;
        let titles = data.map(item=>{
            return item.name
        })
        let values = data.map(item=>{
            return item.deviceCount
        })
        setOption(titles, values)
    },
    error: function () {
        layer.close(index)
    }
})
function setOption(title,values){
    // 指定图表的配置项和数据
    const option = {
        title: {
            text: '设备使用统计图',
            top:'10',
            left:'center'
        },
        tooltip: {},
        legend: {
            data: ['设备数量'],
            right:50
        },
        xAxis: {
            data: title
        },
        yAxis: {
        },
        series: [
            {
                name: '设备数量',
                type: 'bar',
                color:['#0da965'],
                data: values,
                barWidth:40,
                barMaxWidth:80,
                barMinWidth: 20,
                label:{
                    show:true,
                    position: 'outside'
                }
            }
        ]
    };
// 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);