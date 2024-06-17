import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
 import { Button, ButtonGroup, Loader, Panel, SelectPicker, Stack } from 'rsuite';


const defaultOptions = {
  theme: {
    mode: 'dark'
  },
  options: {
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    },
    legend: {
      show: true
    },
    noData: {
      text: "No Data available right now.",
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
         fontSize: '14px',
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
      },
      // height: 550,
      type: 'area'
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          plotOptions: {
            bar: {
              horizontal: false
            }
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      type: "datetime"
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy'
      },
    },
  },
};






const BarChart = ({ title, actions, series, type, labels, options, dataOptions, loading }) => 
{
  
  return(
  <Panel
    className="card"
    header={
      <Stack justifyContent="space-between">
        {title}
        {actions}
      </Stack>
    }
  >

    
    
    {
      loading &&  <>
      <Loader backdrop content="loading..." vertical /></>
    }
    <div id='chart'>
      <div id="toolbar">
      {dataOptions}
      </div>
    <ReactApexChart
      series={series}
      type={type}
      height={380}
      options={defaultOptions}
    /></div>
  </Panel>
);
  }

export default BarChart;