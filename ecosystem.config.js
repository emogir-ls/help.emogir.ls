module.exports = {
  apps: [
    {
      name: "docusaurus",
      script: "node_modules/@docusaurus/core/bin/docusaurus.mjs",
      args: "serve --port 3004 --host 0.0.0.0",
      cwd: process.cwd(),
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};

