# VPS Quick Start Guide - TL;DR Version

## Prerequisites
- 2-4 hours of time
- Basic Linux knowledge
- $9/month budget

---

## Phase 1: Purchase & Connect (10 min)

```bash
# 1. Buy Hostinger VPS 2 ($8.99/mo)
#    - https://www.hostinger.com/vps-hosting
#    - Select Ubuntu 22.04

# 2. Connect via SSH
ssh root@YOUR_VPS_IP
```

---

## Phase 2: Security Setup (20 min)

```bash
# Update system
apt update && apt upgrade -y

# Create user
adduser deploy
usermod -aG sudo deploy

# Setup firewall
apt install ufw -y
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Exit and reconnect as deploy user
exit
ssh deploy@YOUR_VPS_IP
```

---

## Phase 3: Install Software (15 min)

```bash
# Install Node.js 20
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20

# Install PM2
npm install -g pm2
pm2 startup
# Copy and run the command it outputs
pm2 save

# Install Nginx
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Git
sudo apt install git -y
```

---

## Phase 4: Deploy Your App (30 min)

```bash
# Clone repo
mkdir ~/projects && cd ~/projects
git clone https://github.com/arsalan507/Script-automation.git viral-analysis
cd viral-analysis

# Setup environment
nano .env.local
# Paste your API keys, save with Ctrl+X, Y, Enter

# Build
npm install
npm run build

# Create PM2 config
nano ecosystem.config.js
```

Paste:
```javascript
module.exports = {
  apps: [{
    name: 'viral-analysis',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3000',
    cwd: '/home/deploy/projects/viral-analysis',
    instances: 1,
    autorestart: true,
    max_memory_restart: '1G',
    env: { NODE_ENV: 'production', PORT: 3000 },
  }]
};
```

```bash
# Start app
pm2 start ecosystem.config.js
pm2 save
```

---

## Phase 5: Configure Nginx (15 min)

```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/viral-analysis
```

Paste (replace YOUR_VPS_IP):
```nginx
server {
    listen 80;
    server_name YOUR_VPS_IP;
    client_max_body_size 100M;
    proxy_read_timeout 300s;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/viral-analysis /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

**🎉 DONE! Visit http://YOUR_VPS_IP**

---

## Optional: Add SSL with Domain (10 min)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renew test
sudo certbot renew --dry-run
```

---

## Essential Commands

```bash
# View app status
pm2 list
pm2 logs viral-analysis

# Restart app
pm2 restart viral-analysis

# Update app
cd ~/projects/viral-analysis
git pull
npm install
npm run build
pm2 restart viral-analysis

# Check resources
pm2 monit
free -m
df -h
```

---

## Add Second Project (Example)

```bash
# Clone
cd ~/projects
git clone https://github.com/user/project2.git
cd project2

# Setup
nano .env.local  # Add keys
npm install && npm run build

# PM2 config (use port 3001)
nano ecosystem.config.js
pm2 start ecosystem.config.js
pm2 save

# Nginx config
sudo nano /etc/nginx/sites-available/project2
# Change: server_name and proxy_pass http://localhost:3001
sudo ln -s /etc/nginx/sites-available/project2 /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## Cost Savings

**1 Project:**
- VPS: $10/mo vs Railway: $15/mo vs Vercel Pro: $20/mo
- **Savings: $5-10/mo**

**3 Projects:**
- VPS: $10/mo vs Railway: $45/mo vs Vercel: $60/mo
- **Savings: $35-50/mo**

---

## When to Use VPS vs Cloud

✅ **Use VPS if:**
- You know Linux basics
- Running 2+ projects
- Want to save money
- Can spend 2-4 hours setup

❌ **Use Cloud if:**
- Linux scares you
- Need it TODAY
- Time > Money
- Want zero maintenance

---

## Troubleshooting

**App won't start:**
```bash
pm2 logs viral-analysis --err
pm2 restart viral-analysis
```

**Can't access site:**
```bash
sudo ufw status  # Check firewall
sudo systemctl status nginx  # Check nginx
pm2 list  # Check app running
```

**Upload fails (413 error):**
```bash
# Edit nginx config
sudo nano /etc/nginx/sites-available/viral-analysis
# Increase: client_max_body_size 200M;
sudo nginx -t && sudo systemctl reload nginx
```

**Timeout (504 error):**
```bash
# Edit nginx config
sudo nano /etc/nginx/sites-available/viral-analysis
# Increase: proxy_read_timeout 600s;
sudo nginx -t && sudo systemctl reload nginx
```

---

**For detailed guide, see:** `VPS-DEPLOYMENT-GUIDE.md`

**Support:**
- Hostinger: https://www.hostinger.com/support
- Next.js Docs: https://nextjs.org/docs/deployment

---

**Total Time:** 90-120 minutes
**Monthly Cost:** $10 (vs $20-60 for cloud)
**Maintenance:** 30 min/month
