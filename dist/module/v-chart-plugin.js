import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _getIterator from 'babel-runtime/core-js/get-iterator';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _extends from 'babel-runtime/helpers/extends';
import _Object$assign from 'babel-runtime/core-js/object/assign';
/** 
 *  @fileOverview Chart component containing all of the generic components required for charts
 *
 *  @author       Brian Greig
 *
 *  @requires     NPM:d3:Vue
 */

/* eslint-env browser */
import barChart from './import/barChart';
import vBarChart from './import/vBarChart';
import lineGraph from './import/lineGraph';
import scatterPlot from './import/scatterPlot';
import pieChart from './import/pieChart';
import areaChart from './import/areaChart';
import bubbleChart from './import/bubbleChart';

var d3 = _Object$assign({}, require('d3-selection'));

/**
 *  Chart is the generic component used for any chart type
 *  @namespace
 */

var Chart = {
  install: function install(Vue) {
    Vue.component('v-chart', {
      props: ['chartData'],
      data: function data() {
        return {
          selector: this.chartData.selector + '-' + this.chartData.chartType
        };
      },

      methods: _extends({
        /**
         * Generate a new Chart of type chartType
         * @memberOf Chart
         */
        initalizeChart: function initalizeChart() {
          var cs = this[this.chartData.chartType]('init');
          this.drawTitle();
          this.generateLegend(cs);
        },

        /**
         * Redraw the Chart when the data is recycled
         * @memberOf Chart
         */
        refreshChart: function refreshChart() {
          this.clearAxis();
          this[this.chartData.chartType]('refresh');
        },

        /**
         * Remove x and y axes
         * @memberOf Chart
         */
        clearAxis: function clearAxis() {
          d3.select('#' + this.chartData.selector).selectAll('.axis').remove();
        },

        /**
         * Remove all content from the SVG
         * @memberOf Chart
         */
        clearCanvas: function clearCanvas() {
          d3.select('#' + this.chartData.selector).selectAll('*').remove();
        },

        /**
         * Appends title and subtitle to the chart
         * @memberOf Chart
         */
        drawTitle: function drawTitle() {
          d3.select('#' + this.chartData.selector).append('text').attr('x', this.width / 2).attr('y', this.titleHeight - this.titleHeight * 0.1).style('text-anchor', 'middle').text(this.chartData.title);

          d3.select('#' + this.chartData.selector).append('text').attr('x', this.width / 2).attr('y', this.titleHeight - this.titleHeight * 0.1 + this.subtitleHeight).style('text-anchor', 'middle').text(this.chartData.subtitle);
        },

        /**
         * Adds a tooltip to the SVG
         * @memberOf Chart
         * @param {Object} d dataset
         * @param {Object} e event x and y coordinates
         */
        addTooltip: function addTooltip(d, e) {
          d3.select('#' + this.chartData.selector).append('rect').attr('x', e.offsetX - 5 - 50).attr('y', e.offsetY - 13 - 25).attr('height', '16px').attr('width', '80px').attr('class', 'tt').attr('fill', 'white');

          d3.select('#' + this.chartData.selector).append('text').attr('x', e.offsetX - 50).attr('y', e.offsetY - 25).attr('class', 'tt').attr('font-size', '10px').text(d.dim + ':' + d.metric);
        },

        /**
         * Removes all tooltips from the SVG
         * @memberOf Chart
         * @param {Object} d dataset
         */
        removeTooltip: function removeTooltip() {
          d3.select('#' + this.chartData.selector).selectAll('.tt').remove();
        },

        /**
         * Override default values 
         * @param {Object} cs configuration of the coordinate systems
         * @param {Object} overrides the additional values that can be used for an object
         * @returns {Object} updated configuration of coordinate system 
         */
        setOverrides: function setOverrides(cs, overrides) {
          overrides = overrides || {};
          var keys = _Object$keys(cs);
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = _getIterator(keys), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var key = _step.value;

              _Object$assign(cs[key], overrides[key]);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return cs;
        },

        /**
         * Generate legend if option -legends- defined as true
         * @memberOf Chart
         * @param {Object} cs configuration of the coordinate system
         */
        generateLegend: function generateLegend(cs) {
          var _this = this;

          if (this.chartData.legends && this.chartData.legends.enabled === true) {
            cs.palette.lineFill = Array.isArray(cs.palette.lineFill) ? cs.palette.lineFill : new Array(cs.palette.lineFill);
            cs.palette.fill = Array.isArray(cs.palette.fill) ? cs.palette.fill : new Array(cs.palette.fill);
            this.metric.forEach(function (e, i) {
              d3.select('#' + _this.chartData.selector).append('text').attr('x', _this.width - 60).attr('y', _this.height * 0.95 - i * 15).style('text-anchor', 'middle').text(_this.metric[i]);

              d3.select('#' + _this.chartData.selector).append("g").attr("class", "legends").append("rect").attr('x', _this.width - 30).attr('y', _this.height * 0.95 - i * 15 - 10).attr("width", 30).attr("height", 10).style("fill", function () {
                var fill = cs.palette.lineFill[i] || cs.palette.fill[i];
                return fill;
              });
            });
          }
        },

        /**
         * Generate Goal 
         * @memberOf Chart
         * @param {Object} cs configuration of the coordinate system
         */

        generateGoal: function generateGoal(cs, svgContainer, shiftAxis, padding) {
          svgContainer.selectAll('line#goal').remove();
          var x1 = shiftAxis ? cs.y.axisWidth : cs.x.scale(this.goal) + padding;
          var x2 = shiftAxis ? 500 : cs.x.scale(this.goal) + padding;
          var y1 = shiftAxis ? cs.y.scale(this.goal) + padding : this.header;
          var y2 = shiftAxis ? cs.y.scale(this.goal) + padding : this.displayHeight - cs.x.axisHeight;

          svgContainer.append("line").attr('x1', x1).attr('x2', x2).attr('y1', y1).attr('y2', y2).attr('id', 'goal').style('stroke', '#708090').style('stroke-width', 1);
        }
      }, typeof barChart !== 'undefined' && { barChart: barChart }, typeof vBarChart !== 'undefined' && { vBarChart: vBarChart }, typeof scatterPlot !== 'undefined' && { scatterPlot: scatterPlot }, typeof pieChart !== 'undefined' && { pieChart: pieChart }, typeof areaChart !== 'undefined' && { areaChart: areaChart }, typeof lineGraph !== 'undefined' && { lineGraph: lineGraph }, typeof bubbleChart !== 'undefined' && { bubbleChart: bubbleChart }),
      computed: {
        /**
         * Dataset getter function
         * @memberOf Chart
         * @returns {Object} normalized dataset
         */
        ds: function ds() {
          var _this2 = this;

          var ds = { metric: [] };
          ds.metric = Array.isArray(this.chartData.metric) ? ds.metric = this.chartData.metric : new Array(this.chartData.metric);
          ds.dim = this.chartData.dim;
          ds.data = this.chartData.data;
          return ds.data.map(function (d) {
            var td = { metric: [] };
            if (!ds.metric[0]) td.metric[0] = d || 0;else {
              ds.metric.forEach(function (e, i) {
                td.metric[i] = d[e] || 0;
              });
            }
            td.dim = _this2.chartData.dim ? d[_this2.chartData.dim] : null;
            return td;
          });
        },

        /**
         * Goal getter function
         * @memberOf Chart
         * @returns {number} Goal 
         */
        goal: function goal() {
          return this.chartData.goal;
        },

        /**
         * Metric getter function
         * @memberOf Chart
         * @returns {array} Metrics 
         */
        metric: function metric() {
          var metric = Array.isArray(this.chartData.metric) ? this.chartData.metric : new Array(this.chartData.metric);
          return metric;
        },

        /**
         * Height getter function
         * @memberOf Chart
         * @returns {number} Chart Height
         */
        height: function height() {
          return this.chartData.height || 200;
        },

        /**
         * Width getter function
         * @memberOf Chart
         * @returns {number} Chart width
         */
        width: function width() {
          return this.chartData.width || 200;
        },

        /**
         * Get the maxium value for metric
         * @memberOf Chart
         * @returns {number} Max value for metric
         */
        max: function max() {
          var max = 0;
          var results = [];
          this.ds.forEach(function (e) {
            results = results.concat([].concat(_toConsumableArray(e.metric)));
          });
          results.forEach(function (e) {
            max = max > e ? max : e;
          });
          return max;
        },

        /**
         * Get the maxium value for triplet
         * @memberOf Chart
         * @returns {Array} Max values for triplet
         */
        maxTriplet: function maxTriplet() {
          var max = {
            v1: 0,
            v2: 0,
            v3: 0
          };
          this.ds.forEach(function (e) {
            max.v1 = max.v1 > e.metric[0] ? max.v1 : e.metric[0];
            max.v2 = max.v2 > e.metric[1] ? max.v2 : e.metric[1];
            max.v3 = max.v3 > e.metric[2] ? max.v3 : e.metric[2];
          });
          return max;
        },

        /**
         * Get the minimum value for dataset
         * @memberOf Chart
         * @returns {number} Min value for metric
         */
        min: function min() {
          var results = [];
          this.ds.forEach(function (e) {
            results = results.concat([].concat(_toConsumableArray(e.metric)));
          });
          return Math.min.apply(Math, _toConsumableArray(results.map(function (o) {
            return o;
          })));
        },

        /**
         * Get the minimum value for triplet
         * @memberOf Chart
         * @returns {Array} Min values for triplet
         */
        minTriplet: function minTriplet() {
          var results = {
            v1: [],
            v2: [],
            v3: []
          };
          this.ds.forEach(function (e) {
            results.v1.push(e.metric[0]);
            results.v2.push(e.metric[1]);
            results.v3.push(e.metric[2]);
          });
          return {
            v1: Math.min.apply(Math, _toConsumableArray(results.v1.map(function (o) {
              return o;
            }))),
            v2: Math.min.apply(Math, _toConsumableArray(results.v2.map(function (o) {
              return o;
            }))),
            v3: Math.min.apply(Math, _toConsumableArray(results.v3.map(function (o) {
              return o;
            })))
          };
        },

        /**
         * Gets the height of the dispaly area
         * @memberOf Chart
         * @returns {number} Height of the chart display
         */
        displayHeight: function displayHeight() {
          if (this.chartData.legends && this.chartData.legends.enabled === true) {
            return this.height * .80;
          } else {
            return this.height;
          }
        },

        /**
         * Gets the height of the title 
         * @memberOf Chart
         * @returns {number} Height of the chart title
         */
        titleHeight: function titleHeight() {
          if (this.chartData.title) return this.chartData.textHeight || 25;
          return 0;
        },

        /**
         * Gets the subtitle height
         * @memberOf Chart
         * @returns {number} Height of chart subtitle
         */
        subtitleHeight: function subtitleHeight() {
          if (this.chartData.subtitle) return this.chartData.textHeight * 0.66 || 25 * 0.66;
          return 0;
        },

        /**
         * Gets the combined height of the title and subtitle
         * @memberOf Chart
         * @returns {number} Total header height
         */
        header: function header() {
          return this.titleHeight + this.subtitleHeight;
        }
      },
      mounted: function mounted() {
        this.initalizeChart();
      },

      watch: {
        chartData: {
          handler: function handler() {
            this.refreshChart();
          },

          deep: true
        }
      },
      template: '<svg :id=\'this.chartData.selector\' x=\'5\' y=\'5\' :height=\'this.height + 20\' :width=\'this.width + 20\'> </svg>'
    });
  }
};

export default Chart;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Chart);
}