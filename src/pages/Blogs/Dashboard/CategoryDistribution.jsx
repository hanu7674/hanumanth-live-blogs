import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Panel, Stack } from 'rsuite';

const CategoryDistribution = ({ data }) => {
  const categoryCounts = {};

  // Group blogs by category and count occurrences
  data?.forEach((blog) => {
    const category = blog.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const chartData = Object.entries(categoryCounts).map(([category, count]) => ({
    x: category,
    y: count,
  }));
  const defaultOptions = {
    theme: {
      mode: 'dark'
    },
    colors: [
      '#3B93A5',
      '#F7B844',
      '#ADD8C7',
      '#EC3C65',
      '#CDD7B6',
      '#C1F666',
      '#D43F97',
      '#1E5D8C',
      '#421243',
      '#7F94B0',
      '#EF6537',
      '#C0ADDB'
    ],

    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false
      }
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

          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
          },
        },
        selection: {
          enabled: true
        },
        animations: {
          enabled: true,
          easing: 'linear'
        },
        dynamicAnimation: {
          enabled: true
        },
        // height: 550,
        type: 'treemap'
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


      tooltip: {
        formatter: (val) => {
          return `${val.x}: ${val.y}`;
        },
      },
    },
  };

  const series = [{
    data: [
      ...chartData,

    ]
  }]
  return (<>
    <Panel className="card-chart" shaded header={
      <Stack justifyContent="center">
        Category-Wise Blog Distribution
      </Stack>
    }>
      <div>
        <div id='chart'>
          <ReactApexChart options={defaultOptions} series={series} type='treemap' /></div>
      </div></Panel></>
  );
};

export default CategoryDistribution;
