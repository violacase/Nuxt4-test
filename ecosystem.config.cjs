// PM2 process config — .cjs because package.json has "type": "module"
// Usage:
//   pm2 start ecosystem.config.cjs
//   pm2 save && pm2 startup   (run the printed sudo command to enable autostart)

'use strict'

module.exports = {
  apps: [
    {
      name: 'nuxt-scaffold',
      script: '.output/server/index.mjs',

      // Load environment from .env file (PM2 6+)
      // Use the absolute path to your .env file:
      env_file: '/mnt/WebDev/Projects/Nuxt_scaffold/.env',

      // Fallback inline env (override in .env file instead)
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '127.0.0.1',
      },

      // Restart policy
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',

      // Logging
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
}
