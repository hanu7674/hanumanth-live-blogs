import React from 'react';
import Chart from 'react-apexcharts';
import { Panel } from 'rsuite';

const defaultOptions = {
  dataLabels: {
    enabled: true
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
        size: '15%'
      },
      offsetY: 0
    },
    stroke: {
      colors: undefined
    }
  },
  colors: ['#5f71e4', '#2dce88', '#fa6340', '#f5365d', '#13cdef'],
  legend: {
    position: 'bottom',
    offsetY: 0
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
  }
};
const options={
  
}
const PieChart = ({ title, data, type, labels }) => (
  <Panel className="card" style={{ height: 380 }} bodyFill header={title}>
    <Chart
      series={data}
      type={type}
      height={340}
      options={Object.assign({}, defaultOptions, options, { labels })}
    ></Chart>
  </Panel>
);

export default PieChart;

