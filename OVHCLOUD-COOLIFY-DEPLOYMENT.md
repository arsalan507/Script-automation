# 🚀 OVHcloud VPS + Coolify Deployment Guide

**Complete Guide for Deploying Next.js Apps on OVHcloud with Coolify**

**Best For**: 2-20 Next.js projects with visual management and auto-deployment

---

## 📊 Overview

This guide shows you how to deploy your Next.js Viral Reel Analysis app (and future projects) on **OVHcloud VPS** using **Coolify** for easy visual management.

### What You'll Get

- ✅ Visual UI for deployment (no command line needed)
- ✅ Auto-deployment from GitHub (git push → auto deploy)
- ✅ Automatic SSL certificates for all domains
- ✅ Built-in monitoring and backups
- ✅ Scale from 2 to 20+ projects on one VPS
- ✅ Cost: ₹536/month for 2-3 projects (₹179/project)

---

## 💰 Pricing & Scaling Plan

### Start Small, Scale as You Grow

| Your Stage | VPS Plan | vCore | RAM | Storage | Price/mo | Projects | Cost/Project |
|------------|----------|-------|-----|---------|----------|----------|--------------|
| **Starting** | **VPS-2** | 6 | 12 GB | 100 GB | **₹536** | 2-3 | **₹179-268** |
| Growing | VPS-3 | 8 | 24 GB | 200 GB | ₹1,071 | 6-8 | ₹134-179 |
| Scaling | VPS-4 | 12 | 48 GB | 300 GB | ₹1,912 | 12-15 | ₹127-159 |
| Production | VPS-5 | 16 | 64 GB | 350 GB | ₹2,830 | 15-18 | ₹157-189 |
| Enterprise | VPS-6 | 24 | 96 GB | 400 GB | ₹3,748 | 20-25 | ₹150-187 |

**Start with VPS-2 (₹536/month)** → Upgrade with 1-click as you add projects!

---

## 🎯 Quick Start (30 Minutes)

### Prerequisites

- ✅ Credit/Debit card for OVHcloud payment
- ✅ GitHub account with your Next.js repository
- ✅ Domain name (optional, can use IP initially)
- ✅ API keys ready (Gemini & OpenAI)

### Time Breakdown

1. Order VPS: 5 minutes
2. Server setup: 10 minutes
3. Install Coolify: 5 minutes
4. Deploy first app: 10 minutes

**Total: 30 minutes to first deployment**

---

## 📋 Step-by-Step Setup

### Step 1: Order OVHcloud VPS (5 minutes)

#### 1.1 Visit OVHcloud India
```
https://www.ovhcloud.com/en-in/vps/
```

#### 1.2 Choose VPS-2
- Click on **VPS-2** plan
- Specifications:
  - 6 vCores
  - 12 GB RAM
  - 100 GB SSD NVMe
  - 1 Gbps unlimited bandwidth
  - Daily automatic backup
- Price: **₹629/month** (shown before taxes)

#### 1.3 Select Configuration

**Location**:
- **Recommended**: Europe (France/Germany)
- **Why**: Best routing to India, lower latency than North America
- **Avoid**: Mumbai (if out of stock)

**Operating System**:
- Choose: **Ubuntu 22.04 LTS**
- **Important**: Do NOT choose Windows or other OS

**Commitment Period**:
- Select: **No commitment** (monthly billing)
- You can upgrade/downgrade anytime

#### 1.4 Complete Order
1. Review order summary
2. Accept terms and conditions
3. Add payment method (Indian cards accepted)
4. Complete payment
5. Wait 5-15 minutes for server provisioning

#### 1.5 Access Credentials
- Check email for:
  - Server IP address
  - Root password
  - SSH access details

---

### Step 2: Initial Server Setup (10 minutes)

#### 2.1 Connect via SSH

**On Mac/Linux**:
```bash
ssh root@YOUR_SERVER_IP
```

**On Windows**:
- Use PuTTY or Windows Terminal
- Host: YOUR_SERVER_IP
- Username: root
- Password: from email

#### 2.2 Update System
```bash
# Update package list
apt update

# Upgrade all packages
apt upgrade -y

# This takes 2-3 minutes
```

#### 2.3 Create Non-Root User (Security Best Practice)
```bash
# Create new user
adduser deployer

# Add to sudo group
usermod -aG sudo deployer

# Switch to new user
su - deployer
```

From now on, use `sudo` for admin commands.

#### 2.4 Configure Firewall
```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Allow Coolify port
sudo ufw allow 8000/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

### Step 3: Install Coolify (5 minutes)

#### 3.1 Run Coolify Installation Script
```bash
# Install Coolify with one command
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
```

This will:
- Install Docker
- Install Docker Compose
- Install Coolify
- Start Coolify service

**Wait 5-10 minutes** for installation to complete.

#### 3.2 Verify Installation
```bash
# Check Coolify status
sudo docker ps | grep coolify

# You should see coolify containers running
```

#### 3.3 Access Coolify Dashboard
1. Open browser
2. Visit: `http://YOUR_SERVER_IP:8000`
3. You'll see Coolify welcome page

#### 3.4 Create Admin Account
1. Set email address
2. Set strong password
3. Click "Register"
4. You're now logged into Coolify!

---

### Step 4: Configure Coolify (5 minutes)

#### 4.1 Add Server (Localhost)
1. In Coolify dashboard, go to "Servers"
2. You'll see "localhost" already added
3. This is your VPS - no action needed

#### 4.2 Configure Email (Optional but Recommended)
1. Go to Settings → Notifications
2. Add email for deployment notifications
3. Get notified when deployments succeed/fail

#### 4.3 Add GitHub Integration
1. Go to Sources → New Source
2. Choose "GitHub App"
3. Click "Install GitHub App"
4. Select your repositories
5. Authorize Coolify

Now Coolify can access your repos!

---

### Step 5: Deploy Your First App (10 minutes)

#### 5.1 Create New Resource
1. Click "New Resource" button
2. Select "Application"
3. Choose "Public GitHub Repository" (or Private if you set up GitHub App)

#### 5.2 Connect Repository
1. **Method 1: Public Repo**
   - Paste: `https://github.com/arsalan507/Script-automation.git`
   - Branch: `main`

2. **Method 2: Private Repo (with GitHub App)**
   - Select your organization
   - Select repository
   - Select branch

#### 5.3 Configure Build Settings
Coolify auto-detects Next.js! Just verify:

- **Build Pack**: Nixpacks (auto-detected)
- **Build Command**: `npm run build` (auto-detected)
- **Start Command**: `npm start` (auto-detected)
- **Port**: 3000 (auto-detected)

#### 5.4 Add Environment Variables
Click "Environment Variables" and add:

```bash
GEMINI_API_KEY=your-gemini-api-key-here
OPENAI_API_KEY=sk-your-openai-api-key-here
GEMINI_MODEL=gemini-2.0-flash-exp
OPENAI_MODEL=gpt-4-turbo-preview
NODE_ENV=production
```

**Important**: Click "Save" after adding each variable

#### 5.5 Configure Domain (Optional)

**Option A: Use IP Address**
- Access via: `http://YOUR_SERVER_IP:PORT`
- No domain needed
- Good for testing

**Option B: Use Custom Domain**
1. In Coolify, go to "Domains"
2. Add domain: `yourapp.com` or `app.yourdomain.com`
3. Coolify shows DNS records needed
4. Update DNS at your domain registrar:
   ```
   Type: A
   Name: @ (or subdomain)
   Value: YOUR_SERVER_IP
   ```
5. Wait 5-60 minutes for DNS propagation

#### 5.6 Deploy!
1. Click "Deploy" button
2. Watch live logs as Coolify:
   - Clones your repo
   - Installs dependencies
   - Builds your app
   - Starts the server
   - Sets up SSL (if domain configured)

**First deployment takes 3-5 minutes**

#### 5.7 Access Your App
Once deployment succeeds:
- **With domain**: https://yourapp.com
- **Without domain**: http://YOUR_SERVER_IP:PORT

🎉 **Your app is live!**

---

## 🔄 Auto-Deployment Setup

### Enable Automatic Deployments

#### Option 1: Auto-Deploy on Git Push (Recommended)
1. In your app settings, enable "Auto Deploy"
2. Select branch (e.g., `main`)
3. Now when you `git push`, Coolify auto-deploys!

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Coolify automatically deploys within 30 seconds!
```

#### Option 2: Manual Deployments
- Click "Deploy" button in Coolify whenever you want
- Good for testing before deploying

---

## 📦 Deploy Multiple Projects

### Adding Project #2, #3, etc.

For each new project, repeat Step 5:

1. Click "New Resource" → "Application"
2. Connect GitHub repo
3. Add environment variables
4. (Optional) Configure domain
5. Deploy!

**Each project runs on a different port** - Coolify handles everything automatically.

### Example Multi-Project Setup
```
VPS-2 (₹536/month):
├── Project 1: viral-reel-analysis.com → Port 3000
├── Project 2: another-app.com → Port 3001
└── Project 3: third-app.com → Port 3002

All managed via Coolify UI!
```

---

## 🔐 Security Best Practices

### 1. Change Default Ports
```bash
# Change SSH port from 22 to custom
sudo nano /etc/ssh/sshd_config

# Find: #Port 22
# Change to: Port 2222

# Restart SSH
sudo systemctl restart sshd

# Update firewall
sudo ufw allow 2222/tcp
sudo ufw delete allow 22/tcp
```

### 2. Disable Root Login
```bash
sudo nano /etc/ssh/sshd_config

# Find: PermitRootLogin yes
# Change to: PermitRootLogin no

sudo systemctl restart sshd
```

### 3. Set Up SSH Keys (Recommended)
```bash
# On your local machine
ssh-keygen -t rsa -b 4096

# Copy to server
ssh-copy-id -p 2222 deployer@YOUR_SERVER_IP

# Disable password auth
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd
```

### 4. Keep System Updated
```bash
# Update weekly
sudo apt update && sudo apt upgrade -y

# Auto-updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 📊 Monitoring & Management

### Coolify Dashboard Features

#### 1. Resource Usage
- View CPU, RAM, Disk usage
- Per-app resource monitoring
- Set up alerts for high usage

#### 2. Logs
- Real-time application logs
- Build logs
- Deployment history
- Filter and search logs

#### 3. Backups
- Configure automatic backups
- Schedule: daily, weekly, monthly
- Restore from backup with 1 click

#### 4. SSL Certificates
- Auto-renew Let's Encrypt certificates
- View expiry dates
- Force SSL for all apps

---

## 🔧 Troubleshooting

### Issue 1: Deployment Failed

**Check build logs**:
1. Go to app in Coolify
2. Click "Deployments"
3. View failed deployment logs

**Common fixes**:
```bash
# Missing dependencies
- Add to package.json and redeploy

# Environment variables missing
- Check .env variables in Coolify

# Port already in use
- Coolify auto-assigns ports, rarely an issue
```

### Issue 2: Can't Access App

**Check firewall**:
```bash
sudo ufw status
# Ensure ports 80, 443, 8000 are allowed
```

**Check DNS**:
```bash
# On your local machine
dig yourapp.com

# Should show YOUR_SERVER_IP
```

**Check Coolify**:
- Ensure deployment status is "Running"
- Check logs for errors

### Issue 3: Out of Memory

**Check RAM usage**:
```bash
free -h
```

**Solutions**:
1. **Add swap** (temporary fix):
```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

2. **Upgrade VPS** (permanent fix):
- In OVHcloud dashboard
- Click "Upgrade"
- Select VPS-3 (24 GB RAM)
- 1-click upgrade, no data loss!

### Issue 4: Slow Performance

**Optimize app**:
- Enable Next.js caching
- Use Image optimization
- Minimize bundle size

**Upgrade VPS**:
- VPS-2 → VPS-3 for more CPU/RAM

---

## 📈 Scaling Guide

### When to Upgrade

| Sign | Current | Upgrade To | Cost Increase |
|------|---------|------------|---------------|
| 3+ apps, RAM >80% | VPS-2 | VPS-3 | +₹535/mo |
| 8+ apps, RAM >80% | VPS-3 | VPS-4 | +₹841/mo |
| 15+ apps, RAM >80% | VPS-4 | VPS-5 | +₹918/mo |

### How to Upgrade

**In OVHcloud Control Panel**:
1. Go to your VPS
2. Click "Upgrade"
3. Select new plan
4. Confirm
5. Server reboots (2-5 min downtime)
6. All data and apps preserved!

**No changes needed in Coolify** - everything keeps working!

---

## 💰 Total Cost Breakdown

### Monthly Costs

**For 2 Projects**:
- VPS-2: ₹536/month
- Per project: ₹268/month
- vs Vercel Pro: Save ₹3,664/month for 2 projects

**For 8 Projects**:
- VPS-3: ₹1,071/month
- Per project: ₹134/month
- vs Vercel Pro: Save ₹17,929/month for 8 projects

**For 15 Projects**:
- VPS-5: ₹2,830/month
- Per project: ₹189/month
- vs Vercel Pro: Save ₹33,170/month for 15 projects

### Annual Savings

| Projects | OVHcloud + Coolify | Vercel Pro | **Annual Savings** |
|----------|-------------------|------------|--------------------|
| 2 | ₹6,432 | ₹57,600 | **₹51,168** |
| 8 | ₹12,852 | ₹2,30,400 | **₹2,17,548** |
| 15 | ₹33,960 | ₹5,40,000 | **₹5,06,040** |

---

## 🎯 Best Practices

### 1. Naming Conventions
```
Project names in Coolify:
- viral-reel-analysis
- client-dashboard
- api-backend

Domains:
- app.yourdomain.com
- dashboard.yourdomain.com
- api.yourdomain.com
```

### 2. Environment Management
- Use Coolify's environment variables (encrypted)
- Never commit secrets to Git
- Different .env for staging vs production

### 3. Deployment Strategy
```
Workflow:
1. Develop locally
2. Push to GitHub
3. Auto-deploy to staging
4. Test
5. Merge to main → auto-deploy to production
```

### 4. Backup Strategy
- Enable daily automated backups in Coolify
- Keep 7 days of backups
- Test restore process monthly

### 5. Monitoring
- Set up email notifications
- Monitor disk usage weekly
- Review logs for errors

---

## 📚 Quick Reference

### Useful Commands

```bash
# Check Coolify status
sudo docker ps | grep coolify

# Restart Coolify
sudo systemctl restart coolify

# View Coolify logs
sudo docker logs -f coolify

# Check disk space
df -h

# Check memory
free -h

# Check running services
sudo systemctl status

# Update system
sudo apt update && sudo apt upgrade -y
```

### Coolify URLs
- **Dashboard**: http://YOUR_SERVER_IP:8000
- **API Docs**: http://YOUR_SERVER_IP:8000/api/v1/docs

### OVHcloud Control Panel
- **Login**: https://www.ovh.com/manager/
- **VPS Management**: Manage → VPS → Your VPS

---

## 🆘 Support Resources

### Coolify
- **Docs**: https://coolify.io/docs
- **Discord**: https://coollabs.io/discord
- **GitHub**: https://github.com/coollabsio/coolify

### OVHcloud
- **Support**: https://www.ovhcloud.com/en-in/support/
- **Community**: https://community.ovh.com/
- **Documentation**: https://help.ovhcloud.com/

### Your App
- **GitHub**: https://github.com/arsalan507/Script-automation
- **Local docs**: See README.md, API_KEYS_GUIDE.md

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] OVHcloud account created
- [ ] VPS-2 ordered and provisioned
- [ ] Server IP received via email
- [ ] GitHub repository ready
- [ ] API keys ready (Gemini, OpenAI)
- [ ] Domain purchased (optional)

### Initial Setup
- [ ] SSH access working
- [ ] System updated
- [ ] Non-root user created
- [ ] Firewall configured
- [ ] Coolify installed
- [ ] Coolify dashboard accessible

### First App Deployment
- [ ] GitHub connected to Coolify
- [ ] Repository added
- [ ] Environment variables configured
- [ ] Domain configured (optional)
- [ ] First deployment successful
- [ ] App accessible via browser
- [ ] SSL certificate working (if domain used)

### Post-Deployment
- [ ] Auto-deployment enabled
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Email notifications configured
- [ ] Security hardening completed

---

## 🎉 Success!

You now have:
- ✅ OVHcloud VPS-2 running (₹536/month)
- ✅ Coolify installed and configured
- ✅ Visual UI for deployments
- ✅ Auto-deployment from GitHub
- ✅ Automatic SSL certificates
- ✅ Ready to scale to 15+ projects
- ✅ Saving ₹51,168/year vs Vercel Pro (for 2 projects)

### Next Steps
1. Deploy your Viral Reel Analysis app
2. Test all 5 phases
3. Add custom domain
4. Deploy project #2
5. Scale as you grow!

---

**Cost**: ₹536/month → ₹268/project (for 2 projects)
**Setup Time**: 30 minutes
**Scaling**: 1-click upgrade to VPS-3/4/5 as needed

**Start deploying now!** 🚀
