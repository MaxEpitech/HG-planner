// Configuration PM2 pour le déploiement en production
module.exports = {
  apps: [
    {
      name: 'hg-europe',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      // Redémarrer l'app en cas de crash
      min_uptime: '10s',
      max_restarts: 10,
    },
  ],
};

