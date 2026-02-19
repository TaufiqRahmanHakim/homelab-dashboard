import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, MemoryStick, HardDrive, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';
import { Metrics } from '../types';

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  detail?: string;
  percentage: number;
  color: string;
  delay?: number;
}

function CircularProgress({ percentage, color, size = 120, strokeWidth = 10 }: { percentage: number; color: string; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="transform -rotate-90"
      style={{ display: 'block' }}
    >
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress circle */}
      <motion.circle
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        style={{
          strokeDasharray: circumference,
        }}
      />
    </svg>
  );
}

function MetricCard({ icon, title, value, detail, percentage, color, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="rounded-2xl p-5 flex items-center gap-6 relative"
      style={{
        background: 'transparent',
        minWidth: '300px',
        flexShrink: 0,
      }}
    >
      {/* Circular Progress with Icon */}
      <div className="relative flex-shrink-0">
        <CircularProgress percentage={percentage} color={color} size={100} strokeWidth={8} />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
        >
          <div
            className="rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              width: 40,
              height: 40,
            }}
          >
            {icon}
          </div>
        </motion.div>
      </div>

      <div className="flex-1 min-w-0 relative z-10 flex flex-col justify-center">
        <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
          {title}
        </h3>
        <div className="text-3xl font-bold text-white mb-0.5">
          {value}
        </div>
        {detail && (
          <div className="text-xs text-white/60 font-medium">
            {detail}
          </div>
        )}
        <div className="mt-2 text-sm font-semibold text-white/80">
          {percentage.toFixed(1)}% used
        </div>
      </div>
    </motion.div>
  );
}

export function MetricsDisplay() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = async () => {
    setRefreshing(true);
    try {
      const data = await api.getMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch metrics');
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(251, 146, 60, 0.1)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(251, 146, 60, 0.2)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: 'rgba(251, 146, 60, 0.2)' }}>
                <AlertCircle className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-orange-300 font-medium text-sm">Metrics unavailable</p>
                <p className="text-orange-400/60 text-xs">Backend connection may be down</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchMetrics}
                className="p-2.5 rounded-xl transition-all"
                style={{
                  background: 'rgba(251, 146, 60, 0.2)',
                  border: '1px solid rgba(251, 146, 60, 0.3)',
                }}
              >
                <RefreshCw className={`w-4 h-4 text-orange-300 ${refreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {!error && !metrics && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-5 h-32 shimmer flex items-center gap-4"
                style={{ minWidth: '300px', flexShrink: 0 }}
              >
                <div className="rounded-full" style={{ width: 100, height: 100, background: 'rgba(255,255,255,0.1)' }} />
                <div className="flex-1">
                  <div className="h-3 w-20 mb-2" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                  <div className="h-8 w-24 mb-2" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                  <div className="h-3 w-32" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!error && metrics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            <MetricCard
              icon={<Cpu className="w-5 h-5 text-white" />}
              title="CPU Usage"
              value={`${metrics.cpu.usage.toFixed(1)}%`}
              percentage={metrics.cpu.usage}
              color="#667eea"
              delay={0}
            />

            <MetricCard
              icon={<MemoryStick className="w-5 h-5 text-white" />}
              title="Memory"
              value={`${metrics.memory.usedPercent.toFixed(1)}%`}
              detail={`${formatBytes(metrics.memory.used)} / ${formatBytes(metrics.memory.total)}`}
              percentage={metrics.memory.usedPercent}
              color="#f093fb"
              delay={0.1}
            />

            <MetricCard
              icon={<HardDrive className="w-5 h-5 text-white" />}
              title="Storage"
              value={`${metrics.disk.usedPercent.toFixed(1)}%`}
              detail={`${formatBytes(metrics.disk.used)} / ${formatBytes(metrics.disk.total)}`}
              percentage={metrics.disk.usedPercent}
              color="#4facfe"
              delay={0.2}
            />

            {/* Refresh button */}
            <div style={{ flexShrink: 0 }}>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchMetrics}
                disabled={refreshing}
                className="h-full p-4 rounded-2xl transition-all disabled:opacity-50"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                }}
                onMouseEnter={(e) => {
                  if (!refreshing) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                <motion.div
                  animate={refreshing ? { rotate: 360 } : {}}
                  transition={{ duration: 0.6, repeat: refreshing ? Infinity : 0, ease: "linear" }}
                >
                  <RefreshCw className={`w-5 h-5 ${refreshing ? 'text-purple-400' : 'text-white/70'}`} />
                </motion.div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
