
	function drawLine(id) {
		  
		var dataPopu = [], dataX = [], dataCorpo = [],dataPhoto= [];
		/*for(var i=data.length-1;i >= 0; i--) {
			dataX.push(data[i].dataTime.slice(5, 10));
			dataPopu.push(data[i].population);
			dataCorpo.push(data[i].corporate);
			dataPhoto.push(data[i].photo);
		}*/
		dataX=["10-19", "10-21", "10-22", "10-23", "10-24", "10-25"];  
		dataPopu=[22, 33, 77, 55, 33, 22];
		dataCorpo=[44, 55, 66, 77, 88, 55];
		dataPhoto=[77, 66, 44, 55, 66, 33];
		var myChart = echarts.init(document.getElementById(id));
		var option = {
			//backgroundColor: '#1E1E1E',
			title : {
				text : '单位（条）',
				left : '0%',
				textStyle : {
					color : '#a5ddf4',
					fontSize : 14.6
				}
			},
			tooltip : {
				//鼠标悬浮横向有阴影显示
				trigger : 'axis',
				axisPointer : {
					type : 'shadow'
				},
			/*formatter: '{b0}: {c0}<br />{b1}: {c1}'*/
			/*	formatter:function(params){
					   console.log(params);
					   //var color=['blue','white'];
			           var name = params[0].name + '<br>';
			           var barName = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:blue;"></span>'+ params[0].value + '<br>';
			           var lineName = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:white;"></span>'+params[1].value+ '<br>';
			           return name + barName + lineName
			       }*/
			},
			legend : {
				z:10,
				data : [ '人口', '法人','证照' ],
				align : 'right',
				right : 0,
				textStyle:{
					color:"#a5ddf4",
					fontSize : 12
				}
			},
			grid : {
				left : '0%',
				right : '0%',
				bottom : '8%',
				top : '10%',
				containLabel : true,//grid 区域是否包含坐标轴的刻度标签,默认不包含
			},
			xAxis : {
				type : 'category',
				data : dataX,
				boundaryGap : [ 0, 0.01 ],
				position : 'bottom',
				axisLine : {
					lineStyle : {
						color : {
							type : 'linear',
							x : 0,
							y : 0,
							colorStops : [ {
								offset : 1,
								color : '#a5ddf4' // 0% 处的颜色
							}, {
								offset : 1,
								color : '#a5ddf4' // 100% 处的颜色
							} ],
							globalCoord : false
						// 缺省为 false
						}
					}
				},
				axisLabel : {
					interval : 1,
					rotate : 40
				},
				axisLabel : {
					show: false,
					textStyle : {
						color : '#d8dce0',
						fontSize : 14.6
					},
					//rotate : 20
				//文字倾斜程度
				}
			},
			yAxis : {
				type : 'value',
				/*y轴阴影*/
				splitLine : {
					lineStyle : {
						color : [ 'rgba(212,235,255,0.1)' ]
					}
				},
				splitArea : {
					show : true,
					areaStyle : {
						color : [ 'rgba(221,232,250,0.1)', 'rgba(255,255,255,0)' ],
						opacity : 0.5
					}
				},
				axisLabel : {
					show: false,
					textStyle : {
						color : '#d8dce0',
						fontSize : 14.6
					}
				},
				axisLine : {
					lineStyle : {
						color : {
							type : 'linear',
							x : 0,
							y : 0,
							colorStops : [ {
								offset : 1,
								color : '#a5ddf4' // 0% 处的颜色
							}, {
								offset : 1,
								color : '#a5ddf4' // 100% 处的颜色
							} ],
							globalCoord : false
						// 缺省为 false
						}
					}
				}
			},
			series : [ {
				symbol: "none",
				name : '人口',
				type : 'line',
				barWidth : '23%', //柱形宽度
				itemStyle : {
					normal : {
						color : 'rgba(65,100,200,1)',
						/*柱子颜色渐变*/
						/*color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [{
								offset: 1, color: 'rgba(65,100,200,1)' // 0% 处的颜色
							}, {
								offset: 0, color: 'rgba(101,253,202,1)' // 100% 处的颜色
							}],
							globalCoord: false // 缺省为 false
						},*/
						opacity : 1
					}
				},
				data : dataPopu
			}, {
				symbol: "none",
				name : '法人',
				barGap : '0',
				type : 'line',
				barWidth : '23%', //柱形宽度
				itemStyle : {
					normal : {
						color : 'rgba(101,253,202,1)',
						//color : '#87f7cf',
						opacity : 1
					}
				},
				data : dataCorpo
			} , {
				symbol: "none",
				name : '证照',
				barGap : '0',
				type : 'line',
				barWidth : '23%', //柱形宽度
				itemStyle : {
					normal : {
						color : '#38b6b6',
						opacity : 1
					}
				},
				data : dataPhoto
			} ]
		};
		//console.log(option);
		myChart.setOption(option);
	}
	
function drawPie(id){
	var myChart1 = echarts.init(document.getElementById(id));

	var option1 = {
	    tooltip: {
	        trigger: 'item',
	        formatter: "{a} <br/>{b}: {c} ({d}%)"
	    },
	    /*legend: {
	        orient: 'vertical',
	        x: 'left',
	        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
	    },*/
	    
	    series: [
	        {
	            name:'访问来源',
	            type:'pie',
	            avoidLabelOverlap: false,
	            center: ['50%', '50%'], 
	            radius: ['60%', '70%'],
	            label: {
	                normal: {
	                    //dshow: false,
	                    position: 'out'
	                },
	                emphasis: {
	                    show: true,
	                    textStyle: {
	                        fontSize: '15',
	                        fontWeight: 'bold'
	                    }
	                }
	            },
	            labelLine: {
	                normal: {
	                    show: false
	                }
	            },
	            data:[
	                {value:335, name:'直接访问'},
	                {value:310, name:'邮件营销'},
	                {value:234, name:'联盟广告'},
	                {value:135, name:'视频广告'},
	                {value:1548, name:'搜索引擎'}
	            ]
	        }
	    ]
	};
	myChart1.setOption(option1);
}

