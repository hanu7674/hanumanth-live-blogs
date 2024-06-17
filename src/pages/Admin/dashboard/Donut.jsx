import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Panel } from 'rsuite';

var options = {
    chart: {
    width: 200,
    type: 'donut',
  },
  plotOptions: {
    pie: {
      startAngle: -90,
      endAngle: 270
    }
  },
  dataLabels: {
    enabled: true,
    style: {
      color: ["#fff"]
    }
  },
  theme:{
    mode: 'dark',
  },
  fill: {
    type: 'gradient',
  },
  legend: {
    positon: 'right',
    offsetY: 0,
    formatter: function(val, opts) {
      return val + " - " + opts.w.globals.series[opts.seriesIndex]
    }
  },
  chart: {
    toolbar: {
      show: true,
    },
    animations: {
      enabled: true,
      easing: 'linear'
    },
    dynamicAnimation: {
      enabled: true
    }
  },
  noData: {
    text: 'No data',
    align: 'center',
    verticalAlign: 'middle',
    offsetX: 0,
    offsetY: 0,
    style: {
      fontSize: '14px',
    }
  },
  plotOptions: {
    pie: {
      customScale: 0.8,
      donut: {
        size: '70%'
      },
      offsetY: 0
    },

  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }],
  colors: ['#5f71e4', '#2dce88', '#fa6340', '#f5365d', '#13cdef'],
  };
const DonutChart = ({ title, data, type, labels, height }) => (
  <Panel className="card" style={{ height: height ? height : 400 }} bodyFill header={title}>
    <div id='chart'>

    <ReactApexChart
      series={data}
      type={type}
       options={Object.assign({}, options, { labels })}
      />
      </div>
  </Panel>
);

export default DonutChart;

