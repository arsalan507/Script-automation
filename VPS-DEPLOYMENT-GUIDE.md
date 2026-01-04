# Complete VPS Deployment Guide for Next.js AI Video Analysis App

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Basic Linux command line knowledge
- [ ] SSH client installed (Terminal on Mac/Linux, PuTTY on Windows)
- [ ] Git installed locally
- [ ] 2-4 hours of uninterrupted time
- [ ] Credit card for VPS purchase (~$9/month)
- [ ] Domain name (optional, but recommended)
- [ ] API keys ready (Gemini, OpenAI)

---

# Part 1: VPS Setup & Initial Configuration (30-45 minutes)

## Step 1: Purchase Hostinger VPS

### 1.1 Select Plan
1. Go to: https://www.hostinger.com/vps-hosting
2. **Recommended Plan**: VPS 2
   - **Price**: $8.99/month
   - **RAM**: 4 GB (needed for 100MB video processing)
   - **CPU**: 2 vCPU cores
   - **Storage**: 100 GB NVMe SSD
   - **Bandwidth**: Unlimited

3. Click "Add to Cart" → Complete purchase

### 1.2 Initial VPS Setup
1. After purchase, go to Hostinger hPanel
2. Navigate to "VPS" section
3. Click on your new VPS
4. **Operating System**: Select **Ubuntu 22.04 LTS** (recommended)
5. Set root password (save this securely!)
6. Click "Setup" and wait 5-10 minutes

### 1.3 Note Your VPS Details
Write down:
- **IP Address**: (e.g., 123.45.67.89)
- **Root Password**: (the one you just set)
- **SSH Port**: Usually 22 (default)

---

## Step 2: Connect to VPS via SSH

### On Mac/Linux:
```bash
ssh root@YOUR_VPS_IP
# Enter password when prompted
```

### On Windows:
1. Download PuTTY: https://www.putty.org/
2. Open PuTTY
3. Host Name: YOUR_VPS_IP
4. Port: 22
5. Click "Open" → Enter password

### Verify Connection:
```bash
# You should see Ubuntu welcome message
whoami
# Output: root

uname -a
# Output: Linux details
```

---

## Step 3: Secure Your VPS (CRITICAL!)

### 3.1 Update System
```bash
apt update && apt upgrade -y
```
**Time**: 5-10 minutes

### 3.2 Create Non-Root User
```bash
# Create new user (replace 'deploy' with your preferred username)
adduser deploy

# Follow prompts:
# - Enter password (save this!)
# - Full Name: [press Enter to skip]
# - Room Number: [press Enter]
# - Work Phone: [press Enter]
# - Home Phone: [press Enter]
# - Other: [press Enter]
# - Is information correct? Y
```

### 3.3 Grant Sudo Privileges
```bash
usermod -aG sudo deploy

# Verify
groups deploy
# Output should include: deploy sudo
```

### 3.4 Setup SSH Key Authentication (Recommended)

**On your local machine** (Mac/Linux):
```bash
# Generate SSH key if you don't have one
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter 3 times (use defaults)

# Copy public key to VPS
ssh-copy-id deploy@YOUR_VPS_IP
# Enter password when prompted
```

**Test SSH key login:**
```bash
ssh deploy@YOUR_VPS_IP
# Should login without password
```

### 3.5 Configure Firewall (UFW)
```bash
# Still logged in as root or use: sudo su

# Install UFW
apt install ufw -y

# Allow SSH (IMPORTANT: Do this BEFORE enabling!)
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS
ufw allow 443/tcp

# Enable firewall
ufw enable
# Type 'y' and press Enter

# Verify status
ufw status
# Output should show: Status: active
```

### 3.6 Disable Root SSH Login (Optional but Recommended)
```bash
# Edit SSH config
nano /etc/ssh/sshd_config

# Find and change these lines:
PermitRootLogin no
PasswordAuthentication no  # Only if using SSH keys

# Press Ctrl+X, then Y, then Enter to save

# Restart SSH
systemctl restart sshd

# IMPORTANT: Test new user login in a NEW terminal window BEFORE closing current session!
```

---

# Part 2: Install Required Software (20-30 minutes)

**From now on, use the 'deploy' user:**
```bash
ssh deploy@YOUR_VPS_IP
```

## Step 4: Install Node.js 20.x

### 4.1 Install Node.js via NVM (Recommended)
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# Verify installation
node --version
# Output: v20.x.x

npm --version
# Output: 10.x.x
```

---

## Step 5: Install PM2 (Process Manager)

```bash
npm install -g pm2

# Verify
pm2 --version

# Configure PM2 to start on boot
pm2 startup
# Copy and run the command it outputs
# Example: sudo env PATH=$PATH:/home/deploy/.nvm/versions/node/v20.x.x/bin...

# Save PM2 configuration
pm2 save
```

---

## Step 6: Install Nginx (Web Server)

```bash
sudo apt install nginx -y

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify
sudo systemctl status nginx
# Should show: active (running)

# Test in browser
# Open: http://YOUR_VPS_IP
# You should see: "Welcome to nginx!"
```

---

## Step 7: Install Git

```bash
sudo apt install git -y

# Verify
git --version

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
```

---

# Part 3: Deploy Your Next.js Application (30-45 minutes)

## Step 8: Clone Your Repository

### 8.1 Setup SSH Key for GitHub (if private repo)
```bash
# Generate SSH key for GitHub
ssh-keygen -t ed25519 -C "your_email@example.com"
# Save to: /home/deploy/.ssh/github_id_ed25519

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/github_id_ed25519

# Copy public key
cat ~/.ssh/github_id_ed25519.pub
# Copy the output

# Add to GitHub:
# 1. Go to GitHub.com → Settings → SSH and GPG keys
# 2. Click "New SSH key"
# 3. Paste the public key
# 4. Click "Add SSH key"
```

### 8.2 Create Projects Directory
```bash
mkdir -p ~/projects
cd ~/projects
```

### 8.3 Clone Your Repository
```bash
# For public repo:
git clone https://github.com/arsalan507/Script-automation.git viral-analysis

# For private repo (after adding SSH key):
git clone git@github.com:arsalan507/Script-automation.git viral-analysis

cd viral-analysis
```

---

## Step 9: Setup Environment Variables

```bash
# Create .env.local file
nano .env.local
```

**Paste your environment variables:**
```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
PORT=3000
```

**Save:** Ctrl+X, then Y, then Enter

### Secure the file:
```bash
chmod 600 .env.local
```

---

## Step 10: Install Dependencies & Build

```bash
# Install dependencies
npm install

# Build Next.js app
npm run build

# Verify build
ls -la .next/
# Should see standalone folder and other build artifacts
```

---

## Step 11: Start Application with PM2

### 11.1 Create PM2 Ecosystem File
```bash
nano ecosystem.config.js
```

**Paste this configuration:**
```javascript
module.exports = {
  apps: [{
    name: 'viral-analysis',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3000',
    cwd: '/home/deploy/projects/viral-analysis',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    error_file: '/home/deploy/.pm2/logs/viral-analysis-error.log',
    out_file: '/home/deploy/.pm2/logs/viral-analysis-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }]
};
```

**Save:** Ctrl+X, then Y, then Enter

### 11.2 Start with PM2
```bash
# Start application
pm2 start ecosystem.config.js

# View status
pm2 status

# View logs
pm2 logs viral-analysis --lines 50

# Save PM2 configuration
pm2 save

# Verify app is running
curl http://localhost:3000
# Should see HTML output
```

---

# Part 4: Configure Nginx as Reverse Proxy (20-30 minutes)

## Step 12: Setup Nginx Configuration

### 12.1 Create Nginx Site Configuration
```bash
sudo nano /etc/nginx/sites-available/viral-analysis
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    listen [::]:80;

    # Replace with your domain or IP
    server_name YOUR_DOMAIN_OR_IP;

    # Increase client body size for video uploads
    client_max_body_size 100M;

    # Increase timeouts for long-running requests
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Important replacements:**
- Replace `YOUR_DOMAIN_OR_IP` with:
  - Your domain: `viral-analysis.yourdomain.com`
  - OR your VPS IP: `123.45.67.89`

**Save:** Ctrl+X, then Y, then Enter

### 12.2 Enable Site
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/viral-analysis /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t
# Should output: syntax is okay, test is successful

# Reload Nginx
sudo systemctl reload nginx
```

### 12.3 Test Application
```bash
# Open in browser:
http://YOUR_VPS_IP

# You should see your Next.js app!
```

---

# Part 5: SSL Certificate with Let's Encrypt (15-20 minutes)

## Step 13: Install Certbot & Get SSL Certificate

**Skip this if you're using IP address only. Requires domain name.**

### 13.1 Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 13.2 Obtain SSL Certificate
```bash
# Replace with your actual domain
sudo certbot --nginx -d viral-analysis.yourdomain.com

# Follow prompts:
# - Enter email address
# - Agree to terms (Y)
# - Share email? (N)
# - Redirect HTTP to HTTPS? (2 - recommended)
```

### 13.3 Test Auto-Renewal
```bash
sudo certbot renew --dry-run

# Should output: Congratulations, all simulated renewals succeeded
```

### 13.4 Verify HTTPS
```bash
# Open in browser:
https://viral-analysis.yourdomain.com

# Should show secure connection!
```

---

# Part 6: Multiple Projects Setup (Advanced)

## Step 14: Deploy Additional Projects on Same VPS

### 14.1 Project Structure
```bash
~/projects/
├── viral-analysis/         (Port 3000)
├── project-2/              (Port 3001)
├── project-3/              (Port 3002)
└── ...
```

### 14.2 Deploy Second Project (Example)

```bash
# Clone second project
cd ~/projects
git clone https://github.com/yourusername/second-project.git project-2
cd project-2

# Create .env.local
nano .env.local
# Add environment variables
# Save and exit

# Install and build
npm install
npm run build

# Create PM2 config
nano ecosystem.config.js
```

**PM2 config for second project:**
```javascript
module.exports = {
  apps: [{
    name: 'project-2',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3001',  // Different port!
    cwd: '/home/deploy/projects/project-2',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,  // Different port!
    },
  }]
};
```

**Start second project:**
```bash
pm2 start ecosystem.config.js
pm2 save
```

### 14.3 Create Nginx Configuration for Second Project
```bash
sudo nano /etc/nginx/sites-available/project-2
```

**Configuration:**
```nginx
server {
    listen 80;
    listen [::]:80;

    server_name project2.yourdomain.com;  # Different subdomain

    client_max_body_size 100M;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;

    location / {
        proxy_pass http://localhost:3001;  # Different port!
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable and reload:**
```bash
sudo ln -s /etc/nginx/sites-available/project-2 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 14.4 Get SSL for Second Project
```bash
sudo certbot --nginx -d project2.yourdomain.com
```

### 14.5 View All Running Projects
```bash
pm2 list

# Output example:
# ┌─────┬────────────────┬─────────┬─────────┬──────────┐
# │ id  │ name           │ mode    │ status  │ port     │
# ├─────┼────────────────┼─────────┼─────────┼──────────┤
# │ 0   │ viral-analysis │ fork    │ online  │ 3000     │
# │ 1   │ project-2      │ fork    │ online  │ 3001     │
# └─────┴────────────────┴─────────┴─────────┴──────────┘
```

### 14.6 Resource Allocation Guidelines

**VPS 2 (4GB RAM, 2 CPU):**
- Can comfortably run: **2-3 Next.js apps**
- Estimated per app:
  - Idle: ~150-300 MB RAM
  - Processing video: ~500-800 MB RAM
  - Peak CPU: 50-80%

**VPS 3 (8GB RAM, 4 CPU) - $14.99/mo:**
- Can comfortably run: **4-6 Next.js apps**
- Better for multiple AI processing apps

---

# Part 7: Maintenance & Monitoring (Ongoing)

## Step 15: Essential Maintenance Commands

### PM2 Management
```bash
# View all apps
pm2 list

# View logs
pm2 logs viral-analysis
pm2 logs viral-analysis --lines 100

# Restart app
pm2 restart viral-analysis

# Stop app
pm2 stop viral-analysis

# Delete app from PM2
pm2 delete viral-analysis

# Monitor resources
pm2 monit
```

### Update Application
```bash
cd ~/projects/viral-analysis

# Pull latest code
git pull origin main

# Install any new dependencies
npm install

# Rebuild
npm run build

# Restart
pm2 restart viral-analysis

# Verify
pm2 logs viral-analysis --lines 50
```

### System Monitoring
```bash
# Check disk space
df -h

# Check memory usage
free -m

# Check CPU usage
top
# Press 'q' to quit

# Check running processes
ps aux | grep node

# Check nginx status
sudo systemctl status nginx

# Check firewall status
sudo ufw status
```

### Nginx Management
```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

### Security Updates
```bash
# Update system packages (monthly)
sudo apt update
sudo apt upgrade -y

# Update Node.js (when new LTS available)
nvm install 20  # or latest LTS
nvm use 20
cd ~/projects/viral-analysis
npm install
npm run build
pm2 restart viral-analysis
```

---

## Step 16: Backup Strategy

### 16.1 Automated Backups Script
```bash
# Create backup script
nano ~/backup.sh
```

**Paste:**
```bash
#!/bin/bash
BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup all projects
cd ~/projects
for project in */; do
    if [ -d "$project" ]; then
        echo "Backing up $project..."
        tar -czf "$BACKUP_DIR/${project%/}_$DATE.tar.gz" \
            --exclude=node_modules \
            --exclude=.next \
            --exclude=.git \
            "$project"
    fi
done

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

**Make executable:**
```bash
chmod +x ~/backup.sh
```

**Test backup:**
```bash
~/backup.sh
ls -lh ~/backups/
```

### 16.2 Schedule Automatic Backups
```bash
# Edit crontab
crontab -e

# Add this line (backup daily at 2 AM):
0 2 * * * /home/deploy/backup.sh >> /home/deploy/backup.log 2>&1
```

---

## Step 17: Troubleshooting Guide

### App Won't Start
```bash
# Check PM2 logs
pm2 logs viral-analysis --err

# Common issues:
# 1. Port already in use
sudo lsof -i :3000
# Kill process if needed: kill -9 PID

# 2. Missing environment variables
cat .env.local  # Verify all variables are set

# 3. Build failed
cd ~/projects/viral-analysis
npm run build  # Check for build errors
```

### 413 Request Entity Too Large
```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/viral-analysis

# Increase client_max_body_size:
client_max_body_size 200M;  # Increase as needed

# Reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

### 504 Gateway Timeout
```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/viral-analysis

# Increase timeouts:
proxy_read_timeout 600s;  # 10 minutes
proxy_connect_timeout 600s;
proxy_send_timeout 600s;

# Reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

### High Memory Usage
```bash
# Check memory
free -m

# Restart apps to free memory
pm2 restart all

# If persistent, upgrade VPS or reduce concurrent apps
```

### Can't Connect to Server
```bash
# Check firewall
sudo ufw status
# Ensure ports 80, 443, 22 are allowed

# Check Nginx
sudo systemctl status nginx
# If stopped: sudo systemctl start nginx

# Check if app is running
pm2 list
# If stopped: pm2 restart viral-analysis
```

---

# Cost Breakdown & Scaling

## Monthly Costs

### Single Project Setup
| Item | Cost |
|------|------|
| Hostinger VPS 2 (4GB RAM) | $8.99 |
| Domain (optional) | $10-15/year (~$1/mo) |
| **Total** | **~$10/month** |
| Plus: API costs (Gemini + OpenAI) | $4-15/month |
| **Grand Total** | **$14-25/month** |

### Multiple Projects (3 apps)
| Item | Cost |
|------|------|
| Hostinger VPS 2 (4GB RAM) | $8.99 |
| 3 Domains (optional) | $30-45/year (~$3/mo) |
| **Total** | **~$12/month** |
| **Cost per app** | **$4/month** |
| Plus: API costs per app | Variable |

### Scaling Options
- **VPS 2 (4GB)**: 2-3 Next.js apps - $8.99/mo
- **VPS 3 (8GB)**: 4-6 Next.js apps - $14.99/mo
- **VPS 4 (16GB)**: 8-12 Next.js apps - $29.99/mo

---

# Quick Reference Commands

## Essential Daily Commands
```bash
# Connect to VPS
ssh deploy@YOUR_VPS_IP

# View app status
pm2 list

# View app logs
pm2 logs viral-analysis

# Restart app
pm2 restart viral-analysis

# Update app
cd ~/projects/viral-analysis && git pull && npm install && npm run build && pm2 restart viral-analysis

# View system resources
htop  # Install with: sudo apt install htop
```

## Emergency Commands
```bash
# Restart everything
pm2 restart all
sudo systemctl restart nginx

# Free up memory
pm2 flush  # Clear PM2 logs
sudo systemctl restart nginx

# View who's using resources
pm2 monit
htop
```

---

# Comparison: VPS vs Cloud Platform

## Total Cost for 3 Projects

### VPS (Hostinger)
- **Base**: $8.99/month
- **Cost per project**: $3/month
- **Total**: $8.99/month + API costs
- **Effort**: 2-4 hours initial, 30 min/month maintenance

### Railway (3 separate projects)
- **Base**: $5/month × 3 = $15/month
- **Usage**: ~$10-15/month × 3 = $30-45/month
- **Total**: $45-60/month + API costs
- **Effort**: 30 minutes total setup, zero maintenance

### Vercel Pro (3 separate projects)
- **Base**: $20/month × 3 = $60/month
- **Total**: $60/month + API costs
- **Effort**: 15 minutes total setup, zero maintenance

**Savings**: VPS saves $36-51/month for 3 projects!

---

# Final Checklist

## Pre-Launch Verification
- [ ] All environment variables set correctly
- [ ] Application builds without errors
- [ ] PM2 shows app as "online"
- [ ] Nginx configuration tested (`sudo nginx -t`)
- [ ] Firewall configured (ports 80, 443, 22 open)
- [ ] Domain DNS pointing to VPS IP (if using domain)
- [ ] SSL certificate installed (if using domain)
- [ ] Backup script created and tested
- [ ] All API keys working (test upload a video)

## Post-Launch Monitoring (First Week)
- [ ] Check PM2 logs daily
- [ ] Monitor server resources (CPU, RAM, disk)
- [ ] Test video upload functionality
- [ ] Verify all 5 analysis phases complete
- [ ] Check response times
- [ ] Review error logs
- [ ] Test from different devices/networks

---

# Support Resources

## When You Need Help

### VPS Issues
- Hostinger Support: https://www.hostinger.com/support
- Hostinger Tutorials: https://www.hostinger.com/tutorials

### Technical Documentation
- Next.js Deployment: https://nextjs.org/docs/deployment
- PM2 Documentation: https://pm2.keymetrics.io/docs
- Nginx Documentation: https://nginx.org/en/docs/
- Ubuntu Server Guide: https://ubuntu.com/server/docs

### Community
- DigitalOcean Community Tutorials (applicable to all VPS)
- Stack Overflow: Tag with [nginx], [pm2], [nextjs]
- Next.js Discord: https://nextjs.org/discord

---

# Conclusion

You now have:
- ✅ A production-ready VPS
- ✅ Your Next.js app deployed and running
- ✅ Secure SSL encryption (if using domain)
- ✅ Ability to host multiple projects
- ✅ Automatic process management
- ✅ Professional nginx reverse proxy
- ✅ Backup strategy
- ✅ Monitoring tools

**Next Steps:**
1. Test your application thoroughly
2. Set up monitoring (optional: install monitoring tools)
3. Document your specific configuration
4. Plan for traffic growth

**Remember:**
- VPS management requires ongoing maintenance
- Keep your system updated monthly
- Monitor resource usage regularly
- Have a rollback plan for updates

---

**Cost Savings vs Cloud**: $36-51/month for 3 projects
**Time Investment**: 2-4 hours initial setup
**Ongoing Time**: 30 minutes/month maintenance

**Worth it if**: You're comfortable with Linux and want maximum cost efficiency for multiple projects.

**Not worth it if**: You value convenience over cost savings - use Railway or Vercel instead.

---

*Last Updated: January 2026*
*Created for: Next.js 16.1.1 AI Video Analysis Application*
