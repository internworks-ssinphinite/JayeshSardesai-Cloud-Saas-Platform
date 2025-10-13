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
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const UsageChart = ({ usageData }) => {
    // This log is for diagnostics. It will appear in your browser's developer console (F12).
    console.log('[UsageChart Component] Received the following data from the backend:', usageData);

    if (!usageData || usageData.length === 0) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted-foreground)' }}>
                No usage data for this period.
            </div>
        );
    }

    const data = {
        labels: usageData.map(d => new Date(d.usage_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'Documents Analyzed',
                data: usageData.map(d => parseInt(d.usage_count, 10)),
                fill: true,
                backgroundColor: 'rgba(109, 40, 217, 0.2)',
                borderColor: 'rgb(109, 40, 217)',
                pointBackgroundColor: 'rgb(109, 40, 217)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(109, 40, 217)',
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false
                },
                ticks: {
                    precision: 0,
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default UsageChart;

