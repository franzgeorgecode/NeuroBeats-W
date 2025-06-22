import React from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { GlassCard } from '../ui/GlassCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface StatsChartsProps {
  listeningData: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  topGenres: Array<{ name: string; count: number; color: string }>;
  topArtists: Array<{ name: string; minutes: number }>;
  className?: string;
}

export const StatsCharts: React.FC<StatsChartsProps> = ({
  listeningData,
  topGenres,
  topArtists,
  className = '',
}) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          font: {
            family: 'Inter',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#8B5CF6',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9CA3AF',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#9CA3AF',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const listeningChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Minutes Listened',
        data: listeningData.weekly,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#8B5CF6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const genresChartData = {
    labels: topGenres.map(genre => genre.name),
    datasets: [
      {
        data: topGenres.map(genre => genre.count),
        backgroundColor: topGenres.map(genre => genre.color),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const artistsChartData = {
    labels: topArtists.map(artist => artist.name),
    datasets: [
      {
        label: 'Minutes',
        data: topArtists.map(artist => artist.minutes),
        backgroundColor: [
          '#8B5CF6',
          '#3B82F6',
          '#EC4899',
          '#22D3EE',
          '#34D399',
        ],
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Listening Activity */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-6">
          <h3 className="text-xl font-space font-bold text-white mb-4">
            Weekly Listening Activity
          </h3>
          <div className="h-64">
            <Line data={listeningChartData} options={chartOptions} />
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Genres */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-xl font-space font-bold text-white mb-4">
              Top Genres
            </h3>
            <div className="h-64">
              <Doughnut 
                data={genresChartData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      ...chartOptions.plugins.legend,
                      position: 'bottom' as const,
                    },
                  },
                }} 
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Top Artists */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-xl font-space font-bold text-white mb-4">
              Top Artists
            </h3>
            <div className="h-64">
              <Bar 
                data={artistsChartData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      display: false,
                    },
                  },
                }} 
              />
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};