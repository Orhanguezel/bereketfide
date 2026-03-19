name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies (FE)
        run: cd frontend && bun install

      - name: Build FE
        run: cd frontend && bun run build

      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_IP }}
          username: root
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            export BUN_INSTALL="/root/.bun"
            export PATH="$BUN_INSTALL/bin:$PATH"
            cd /var/www/vistainsaat

            # Pull changes (if using git on server) or rsync
            # For simplicity in this demo, we assume the server has git and is a clone
            # In a real scenario, we might use rsync to push artifacts.

            # Backend
            cd /var/www/vistainsaat/backend
            git pull origin main
            bun install
            bun run build
            pm2 restart vistainsaat-backend || pm2 start dist/app.js --name vistainsaat-backend

            # Frontend
            cd /var/www/vistainsaat/frontend
            git pull origin main
            bun install
            bun run build
            pm2 restart vistainsaat-frontend || pm2 start "bun run start" --name vistainsaat-frontend

            # Admin Panel
            cd /var/www/vistainsaat/admin_panel
            git pull origin main
            bun install
            bun run build
            pm2 restart vistainsaat-admin || pm2 start "bun run start" --name vistainsaat-admin
