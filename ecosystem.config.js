module.exports = {
  apps: [
    {
      name: 'tjmun-website',
      script: 'npm',
      args: 'start',
      cwd: '/project/tjmun_site', // 部署时请修改为实际的项目路径
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // 优化 Node.js 内存使用（2G 服务器配置）
        NODE_OPTIONS: '--max-old-space-size=300',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      // 降低内存限制，超过 300MB 自动重启
      max_memory_restart: '300M',
      // 优化进程管理
      kill_timeout: 5000,
      // 移除 wait_ready，Next.js 生产模式不支持 ready 信号
      // wait_ready: true,
      listen_timeout: 10000,
      // 日志管理
      log_type: 'json',
      // 性能监控
      pmx: true,
    },
  ],
}
