'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Web Vitals reporting disabled — no backend endpoint available
    // To re-enable, add POST /api/vitals to the backend

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      const color =
        metric.rating === 'good'
          ? '\x1b[32m'
          : metric.rating === 'needs-improvement'
            ? '\x1b[33m'
            : '\x1b[31m';
      console.log(`${color}[${metric.name}]\x1b[0m ${metric.value.toFixed(1)}ms (${metric.rating})`);
    }
  });

  return null;
}
