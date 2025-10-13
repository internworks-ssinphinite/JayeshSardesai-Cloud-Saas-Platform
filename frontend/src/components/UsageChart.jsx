// frontend/src/components/UsageChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const UsageChart = ({ usageData }) => {
    const data = {
        labels: usageData.map(d => new Date(d.usage_date).toLocaleDateString()),
        datasets: [
            {
                label: 'Documents Analyzed',
                data: usageData.map(d => d.usage_count),
                fill: false,
                backgroundColor: 'rgb(109, 40, 217)',
                borderColor: 'rgba(109, 40, 217, 0.5)',
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return <Line data={data} options={options} />;
};

export default UsageChart;