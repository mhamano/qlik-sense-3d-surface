define( [
	"qlik",
	'./properties',
	"./lib/js/utils",
	"./lib/vendor/plotly.min",
	"underscore",
	"css!./qlik-sense-3d-surface.css"],
	function ( qlik, props, utils, Plotly, _ ) {
		"use strict";
		return {
			initialProperties: {
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 3,
						qHeight: 1000
					}]
				}
			},
			definition: props,
			support: {
				snapshot: false,
				export: false,
				exportData: true
			},
			paint: function ($element, layout) {
				var self = this;
				var extId = layout.qInfo.qId;
				var elementId = "surface-chart-" + extId;

				$element.html('<div qv-extension id="' + elementId + '" style="width:100%;height:100%;"></div>');

				utils.pageExtensionData(layout, this, function(dataPages) {
					var measureInfo = layout.qHyperCube.qMeasureInfo;

					var elemNum = [];
          var x = [];
          var y = [];
          var mea1 = [];

					$.each(dataPages, function(key, value) {
						elemNum.push(value[0].qElemNumber);
						x.push(value[0].qText);
						y.push(value[1].qText);
						mea1.push(value[2].qNum);
					});

					var x_uniq = _.uniq(x);
					var y_uniq = _.uniq(y);

					var matrixData = [];
					for(var i = 0; i < x_uniq.length; i++) {
						matrixData[x_uniq[i]] = [];
					}

					for(var i = 0; i < mea1.length; i++) {
						matrixData[x[i]][y[i]] = mea1[i];
					}

					//Remove empty elements from matrixData array (to y direction)
					matrixData = matrixData.filter(function(data) {
					    // keep element if it's not an object, or if it's a non-empty object
					    return typeof data != "object" || Array.isArray(data) || Object.keys(data).length > 0;
					});

					//Remove empty elements from matrixData[i] array (to x direction)
					for(var i = 0; i < matrixData.length; i++) {
						matrixData[i] = matrixData[i].filter(function(data) {
								// keep element if it's not an object, or if it's a non-empty object
								return typeof data != "object" || Array.isArray(data) || Object.keys(data).length > 0;
						});
					}

					var chartData = [
						{
							x: x_uniq,
							y: y_uniq,
							z: matrixData,
							elemNum: elemNum,
							type: 'surface',
							contours: {
						    x: { show: layout.props.contours },
						    y: { show: layout.props.contours },
						    z: { show: layout.props.contours }
						  },
							showscale: layout.props.scale
						}];

						var chartLayout = {
							title: layout.title,
							autosize: true,
							scene: {
								xaxis: {
	          			title: layout.qHyperCube.qDimensionInfo[0].qFallbackTitle
								},
								yaxis: {
	          			title: layout.qHyperCube.qDimensionInfo[1].qFallbackTitle
								},
								zaxis: {
	          			title: layout.qHyperCube.qMeasureInfo[0].qFallbackTitle
								}
							},
							margin: {
								l: 65,
								r: 50,
								b: 65,
								t: 90,
								//t: 0
							}
						};

						var chartConfig = {
							scrollZoom: true,
							showLink: false,
							displaylogo: false,
							modeBarButtonsToRemove: ['sendDataToCloud'],
						};

						var chart = document.getElementById(elementId);
						Plotly.newPlot(chart, chartData, chartLayout, chartConfig);

						chart.on('plotly_click', function (eventData) {
							if (typeof eventData != 'undefined' && eventData.points.length > 0) {
								var x = parseInt(eventData.points[0].x, 10);
								var y = parseInt(eventData.points[0].y, 10);

								self.selectValues(0, [x], false);
								self.selectValues(1, [y], false);
							}
						});
				});
			}
		};

	} );
