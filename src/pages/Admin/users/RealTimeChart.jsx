import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import Loading from '../../../components/Loading/loading'; // Assuming a loading component
import { Panel } from 'rsuite';

const RealTimeScrollingChart = ({ data, dataOptions }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching or update (replace with actual implementation)
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Delay for initial data loading

    const interval = setInterval(() => {
      // Fetch new data (replace with actual implementation)
      updateChartData();
    }, 60000); // Update every 1 minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updateChartData();
  }, [data]);
  const updateChartData = () => {
    const time = new Date();
    const oldestTimestamp = new Date(time.getTime());
    oldestTimestamp.setMinutes(time.getMinutes() - 30);
  
    const filteredData = data.filter(item => new Date(item.timestamp.seconds * 1000) > oldestTimestamp);
  
    const groupedData = filteredData.reduce((acc, item) => {
      const timestamp = new Date(item.timestamp.seconds * 1000 + Math.round(item.timestamp.nanoseconds / 1000000));
      const minuteRoundedTimestamp = timestamp - (timestamp % 60000);
      acc[minuteRoundedTimestamp] = acc[minuteRoundedTimestamp] || { counts: 0, timestamp: minuteRoundedTimestamp };
      acc[minuteRoundedTimestamp].counts += item.count;
      return acc;
    }, {});
  
    // Create an array for the last 10 minutes
    const last10Minutes = Array.from({ length: 30 }, (_, i) => {
      const minute = new Date(time.getTime());
      minute.setMinutes(time.getMinutes() - i);
      return {
        x: minute.getTime() - (minute.getTime() % 60000),
        y: 0
      };
    });  
    Object.values(groupedData).forEach(value => {
      const index = last10Minutes.findIndex(item => item.x === value.timestamp);
      if (index !== -1) {
        last10Minutes[index].y += value.counts;
      } else {
        last10Minutes.push({ x: value.timestamp, y: value.counts });
      }
    });
    
    const minuteRoundedData = [...last10Minutes].sort((a, b) => a.x - b.x).map(value => ({
      x: value.timestamp || value.x, // Use timestamp if available, otherwise use x
      y: value.counts || value.y, // Use counts if available, otherwise use y
    }));
  
    setChartData(minuteRoundedData);
  };

  const options = {
    theme: {
        mode: 'dark'
    },
    chart: {
      type: 'line',
      height: 350,
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: true,
    },
    zoom: {
        enabled: false
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      show: true,
      lineCap: "round",
    },
    
    xaxis: {
      type: 'datetime',
      title: {
        text: 'Registered Users (Last 30 minutes)',
        style: {
          color: "whitesmoke",
          fontWeight: '',
          cssClass: {
            padding: '10px'
          }
        }
      },
      labels: {
        formatter: val => new Date(val).toLocaleTimeString('en-US',  { hour12: false, hour: '2-digit', minute: '2-digit' }),
      },
    },
    yaxis: {
      title: {
        text: 'Count',
        style: {
          color: "whitesmoke",
          fontWeight: '',
          cssClass: {
            padding: '10px'
          }
        }
      },
    },
    tooltip: {
      x: {
        format: 'HH:mm',
      },
    },
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Panel header={dataOptions} className="card">
        <ReactApexChart
          options={options}
          series={[{name: 'Users Count', data: chartData }]}
          type="line"
          height={350}
        />
        </Panel>

      )}
    </div>
  );
};

export default RealTimeScrollingChart;
