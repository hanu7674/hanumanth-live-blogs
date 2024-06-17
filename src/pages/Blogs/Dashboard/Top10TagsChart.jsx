import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import Loading from '../../../components/Loading/loading';
import { Panel, Stack } from "rsuite";

const Top10TagsBarChart = ({ tags, loading }) => {
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (Array.isArray(tags)) {
      const newSeries = [{
        name: "Tag Count",
        data: tags.map((tag) => tag[1]),
      }];
      const newCategories = tags.map((tag) => tag[0]);
      setSeries(newSeries);
      setCategories(newCategories);
    } else {
      setSeries([]);
      setCategories([]);
    }
  }, [tags]);

  const options = {
    colors: [
      "#2ECC71", // Emerald Green
      "#3498DB", // Bright Blue
      "#9B59B6", // Amethyst
      "#F1C40F", // Sunshine Yellow
      "#E74C3C", // Cherry Red
      "#1ABC9C", // Turquoise
      "#95A5A6", // Grayish Blue
      "#D35400", // Orange
      "#2980B9", // Royal Blue
      "#7F8C8D", // Light Gray
    ],
    theme: {
      mode: 'dark'
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
      height: 350,
      type: "bar",
      events: {
        click: function (chart, w, e) {
          // console.log(chart, w, e)
        },
      },
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
    // stroke: {
    //   curve: 'smooth'
    // },

    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true,
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: [
            "#2ECC71", // Emerald Green
            "#3498DB", // Bright Blue
            "#9B59B6", // Amethyst
            "#F1C40F", // Sunshine Yellow
            "#E74C3C", // Cherry Red
            "#1ABC9C", // Turquoise
            "#95A5A6", // Grayish Blue
            "#D35400", // Orange
            "#2980B9", // Royal Blue
            "#7F8C8D", // Light Gray
          ],
          fontSize: "12px",
        },
      },
    },
  };

  return (
    <Panel className="card-chart"  header={<Stack justifyContent="center">Top 10 Tags used in All blogs.  </Stack>} shaded>
      <div id="chart">
        {loading ? (
          <Loading />
        ) : (
          <ReactApexChart options={options} series={series} type="bar" height={350} />
        )}
      </div>
     </Panel>
  );
};

export default Top10TagsBarChart;
