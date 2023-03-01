import {
  BarElement,
  Chart as ChartJS,
  Color,
  CategoryScale,
  Filler,
  LayoutPosition,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

export const chartColors: {opaque: Color[]; transparent: Color[]} = {
  opaque: [
    'rgb(140, 98, 252)',
    'rgb(66, 133, 211)',
    'rgb(199, 86, 178)',
    'rgb(64, 137, 157)',
  ],
  transparent: [
    'rgb(140, 98, 252, 0.25)',
    'rgb(66, 133, 211, 0.25)',
    'rgb(199, 86, 178, 0.25)',
    'rgb(64, 137, 157, 0.25)',
  ],
};

export function registerBarChart(): void {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  );
}

export const barChartOptions = {
  plugins: {
    legend: {
      position: 'bottom' as LayoutPosition,
    },
  },
  responsive: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

export function registerLineChart(): void {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  );
}

export const lineChartOptions = {
  plugins: {
    legend: {
      position: 'bottom' as LayoutPosition,
    },
  },
  responsive: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  scales: {
    y: {
      min: 0,
      stacked: true,
    },
  },
};
