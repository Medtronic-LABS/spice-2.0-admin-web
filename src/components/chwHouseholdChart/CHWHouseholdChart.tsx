import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { IHouseholdRegistrationData } from '../../store/chwHouseholdRegistration/types';
import '../../styles/chwHouseholdChart.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ICHWHouseholdChartProps {
  data: IHouseholdRegistrationData[];
  overallAchievement: number;
}

const CHWHouseholdChart: React.FC<ICHWHouseholdChartProps> = ({ data, overallAchievement }) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Households',
        data: data.map(item => item.registered),
        backgroundColor: 'var(--green)',
        borderColor: 'var(--green)',
        borderWidth: 1,
        stack: 'stack1'
      },
      {
        label: 'Target',
        data: data.map(item => item.target - item.registered),
        backgroundColor: 'var(--burnt-orange)',
        borderColor: 'var(--burnt-orange)',
        borderWidth: 1,
        stack: 'stack1'
      }
    ]
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: `Month Wise Household Registration of a CHW`,
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context: any) {
            const dataIndex = context.dataIndex;
            const achievement = data[dataIndex]?.achievement || 0;
            return `Achievement: ${achievement.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          color: '#dfdfdf'
        },
        ticks: {
          color: '#888888',
          font: {
            size: 12
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: '#dfdfdf'
        },
        ticks: {
          color: '#888888',
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: 'Households',
          color: '#888888',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  };

  return (
    <div className="chw-household-chart">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="chart-title mb-0">Month Wise Household Registration of a CHW</h4>
        <div className="achievement-indicator">
          <span className="achievement-percentage">{overallAchievement}%</span>
          <span className="achievement-label ms-2">Target</span>
        </div>
      </div>
      <div style={{ height: '400px', width: '100%' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CHWHouseholdChart;
