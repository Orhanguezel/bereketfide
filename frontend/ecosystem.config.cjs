// =============================================================
// FILE: ecosystem.config.cjs
// Bereket Fide Frontend — PM2 config
// - binds to 127.0.0.1:3030 (reverse proxy only)
// - crash-loop protection + graceful shutdown
// - logs under /home/orhan/.pm2/logs
// =============================================================

module.exports = {
  apps: [
    {
      name: 'bereketfide-frontend',
      cwd: '/var/www/bereketfide/frontend',
      script: '/home/orhan/.bun/bin/bun',
      args: 'run start:standalone',
      exec_mode: 'fork',
      instances: 1,
      watch: false,
      autorestart: true,
      max_memory_restart: '450M',
      min_uptime: '30s',
      max_restarts: 10,
      restart_delay: 5000,
      kill_timeout: 8000,
      listen_timeout: 10000,
      env: {
        NODE_ENV: 'production',
        PORT: '3030',
        HOSTNAME: '127.0.0.1',
        NEXT_TELEMETRY_DISABLED: '1',
      },
      out_file: '/home/orhan/.pm2/logs/bereketfide-frontend.out.log',
      error_file: '/home/orhan/.pm2/logs/bereketfide-frontend.err.log',
      combine_logs: true,
      time: true,
    },
  ],
};
