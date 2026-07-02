module.exports = {
  apps: [
    {
      name: 'smarterp-production-api',
      script: './index.js',
      instances: 'max', // Scales app across all available physical CPU cores
      exec_mode: 'cluster', // Enables round-robin zero-downtime load balancing
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      max_memory_restart: '1G', // Restarts a cluster instance if a memory leak occurs
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};