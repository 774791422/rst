/**
 * 
 * 
 */

var option, divId, flag;

/**
 * 对外的接口
 * jsonData ：map数据类型 ：包含必要的key值，和不必要的key
 * 		divId:展示图形的divd的id ;
 * 		type:图形的类型(bar,line等); 
 * 		orientation:柱状图的排列方向（1：左右排列（默认），2：上下排列）
 * 		grid:图形的边距 ，数据类型为数组[上，下，左，右]  有默认值
 * 		tooltip：浮窗是否显示 true（默认），false
 *			color: ['#000000','#3398DB']  数组类型，含有默认值
 *			backgroundColor：   背景颜色，有默认值
 *			title:标题，数据为map格式
 *			legend:图标设置，数据为map格式
 *			series:用于配置图形特有的属性
 * url: 后台接口的路径
 * @returns
 */
function outerJoint(jsonData) {
	//console.log("jsonData>>" + JSON.stringify(jsonData));

	selectGraphics(jsonData);
}

/**
 * 填充数据，生成图形
 * @param configData:图形配置参数
 * @returns
 */
function selectGraphics(configData) {
	divId = configData.divId;//在Map中获取id

	//根据图形类型 选择执行的方法
	if (configData.type == "bar" || configData.type == "line") {
		var option = barOption(configData);//折线图- 柱状图
		
	} else if (configData.type == "pie") {
		var option = pieOption(configData);//饼图
	}

	// grid 图形边距的设置
	if (configData.grid != undefined) {
		option.grid = {
			top : configData.grid[0] + '%',
			bottom : configData.grid[1] + '%',
			left : configData.grid[2] + '%',
			right : configData.grid[3] + '%',
			containLabel : true
		};
	}
	//tooltip浮窗是否显示
	if (configData.tooltip == false) {
		option.tooltip.show = false;
	}
	//color: ['#000000','#3398DB'] 图形颜色
	if (configData.color != undefined) {
		option.color = configData.color;
	}
	//backgroundColor 背景颜色
	if (configData.backgroundColor != undefined) {
		option.backgroundColor = configData.backgroundColor;
	}
	//title 标题
	if (configData.title != undefined) {
		option.title = configData.title;
	}
	//legend 图标
	if (configData.legend != undefined) {
		option.legend = configData.legend;
	}
	//series

	console.log(option);
	var myChart = echarts.init(document.getElementById(divId));
	myChart.setOption(option);

}
/**
 * 柱状图 - 折线图
 * @returns
 */
function barOption(configData) {
	/**
	 * 将配置参数直接传到这，在这进行解析配置
	 */
	//series
	var seriesData = []; //用于存放所有的series数据 里层为map
	var barWidthD = "30%";
	var barGapD = "5";
	// barWidthD 柱宽度 barGapD 柱间距
	if(configData.series != undefined){
		if (configData.series.barWidth != undefined) {
			barWidthD = configData.series.barWidth;
		}
		if (configData.series.barGap != undefined) {
			barGapD = configData.series.barGap;
		}
	}
	for (var v = 1; v < 4; v++) {
		var seMap = {};
		if (v == 1) {//因为命名问题，故将第一条数据与其他的分别开处理
			seMap = {
				name : configData.valueName,
				 barWidth : barWidthD,
				 barGap:barGapD,
				data : configData.value,
				type : configData.type
			};
			
			//seriesData[0].put( configData.series);
		} else {
			var name = 'value' + v + 'Name';
			var value = 'value' + v;
			if (configData[value] == undefined) {// 获取不到值就跳出循环
				break;
			}
			seMap={
				name : configData[name],
				 barWidth : barWidthD,
				 barGap:barGapD,
				data : configData[value],
				type : configData.type
			};
		}
		
		seriesData.push(seMap);
		 
	}
	 
	 
	//	用于根据参数 调整柱状图的排列方式
	var orientation = configData.orientation;
	var xAxisTypeD = 'category'; //默认x轴坐标类型
	var yAxisTypeD = 'value';//默认y轴坐标类型
	var xAxisDataD = configData.axisData;//默认x轴坐标数据
	var yAxisDataD = '';//默认y轴坐标数据
	if (orientation == 2) {//上下排列
		var xAxisTypeD = 'value';
		xAxisDataD = '';
		var yAxisTypeD = 'category';
		yAxisDataD = configData.axisData;
	}
	var seriesTypeD = configData.type;

	var option = {

		xAxis : {
			type : xAxisTypeD,
			data : xAxisDataD
		},
		yAxis : {
			type : yAxisTypeD,
			data : yAxisDataD
		},
		tooltip : {
			show : true,
			trigger : 'axis',
		},
		series : seriesData
	};
	return option;
}
/**
 * 饼形图
 * @param configData
 * @param xyData
 * @returns
 */
function pieOption(configData) {
	var option = {
		series : [ {
			name : '访问来源',
			type : 'pie',
			radius : '55%',
			center : [ '40%', '50%' ],
			data : [ {
				value : 335,
				name : '直接访问'
			}, {
				value : 310,
				name : '邮件营销'
			}, {
				value : 234,
				name : '联盟广告'
			}, {
				value : 135,
				name : '视频广告'
			}, {
				value : 1548,
				name : '搜索引擎'
			} ],
			itemStyle : {
				emphasis : {
					shadowBlur : 10,
					shadowOffsetX : 0,
					shadowColor : 'rgba(0, 0, 0, 0.5)'
				}
			}
		} ]
	};

	if (configData.series != undefined) {
		if (configData.series.radius != undefined) {
			option.series[0].radius = configData.series.radius;
		}
		if (configData.series.center != undefined) {
			option.series[0].center = configData.series.center;
		}

	}
	return option;
}
