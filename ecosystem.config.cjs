// Before using: run bash setup.sh or manually replace YOUR_PROJECT_NAME and YOUR_PROJECT_PATH
// PM2 process config — .cjs because package.json has "type": "module"
// Usage:
//   pm2 start ecosystem.config.cjs
//   pm2 save && pm2 startup   (run the printed sudo command to enable autostart)

'use strict'

module.exports = {
  apps: [
    {
      name: 'YOUR_PROJECT_NAME',
      script: '.output/server/index.mjs',

      // Load environment from .env file (PM2 6+)
      // Use the absolute path to your .env file:
      env_file: 'YOUR_PROJECT_PATH/.env',

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
