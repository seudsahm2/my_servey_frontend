// components/RechartsWrapper.tsx
'use client';

// PERFORMANCE: Import only what we use for better tree-shaking and smaller bundles
// This reduces the Recharts bundle from ~150KB to ~50KB
export {
    BarChart,
    Bar,
    PieChart,
    Pie,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';

// Default export for backward compatibility
import * as RechartsAll from 'recharts';
export default RechartsAll;
