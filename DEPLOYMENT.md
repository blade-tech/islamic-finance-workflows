# Deployment Guide - Islamic Finance Workflows

This guide covers deploying the Islamic Finance Workflows application following GitHub best practices.

## 📋 Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Setup](#environment-setup)
- [GitHub Repository Setup](#github-repository-setup)
- [Deployment Options](#deployment-options)
- [CI/CD Pipeline](#cicd-pipeline)
- [Post-Deployment Verification](#post-deployment-verification)

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables are documented in `.env.example` files
- [ ] `.gitignore` properly excludes sensitive files (`.env`, `.env.local`, API keys)
- [ ] Dependencies are locked (`package-lock.json` is committed)
- [ ] Application builds successfully (`npm run build`)
- [ ] Tests pass (if configured)
- [ ] README.md is comprehensive and up-to-date

## 🔧 Environment Setup

### Required Services

Ensure you have accounts and credentials for:

1. **Anthropic Claude API** - AI processing
2. **OpenAI API** - Embeddings for Graphiti
3. **LlamaParse API** - PDF parsing
4. **Neo4j Aura** - Knowledge graph database

### Environment Variables

#### Frontend (.env.local)

```env
PORT=3030
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production:
```env
PORT=3030
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

#### Backend (backend/.env)

```env
# AI APIs
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
LLAMAPARSE_API_KEY=your_key_here

# Neo4j
NEO4J_URI=neo4j+ssc://your_instance.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password_here

# FastAPI
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3030,https://your-frontend-domain.com

# Configuration
CLAUDE_MODEL=claude-sonnet-4-5-20250929
CLAUDE_MAX_TOKENS=16384
CLAUDE_TEMPERATURE=0.7
LOG_LEVEL=INFO
DEBUG=false
```

## 🐙 GitHub Repository Setup

### 1. Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Islamic Finance Workflows"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (private recommended for production apps)
3. Do NOT initialize with README (we already have one)

### 3. Connect Local Repository

```bash
git remote add origin https://github.com/YOUR_USERNAME/islamic-finance-workflows.git
git branch -M main
git push -u origin main
```

### 4. Set Up Branch Protection

In GitHub repository settings:

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date

### 5. Configure GitHub Secrets

In repository **Settings** → **Secrets and variables** → **Actions**:

Add the following secrets:

- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `LLAMAPARSE_API_KEY`
- `NEO4J_URI`
- `NEO4J_USER`
- `NEO4J_PASSWORD`

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Frontend)

#### Frontend Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Configure Environment Variables** in Vercel Dashboard:
   - `NEXT_PUBLIC_API_URL=https://your-backend-url.com`

4. **Connect to GitHub** for automatic deployments

#### Advantages

- Zero-config Next.js deployment
- Automatic preview deployments for PRs
- Global CDN
- Free tier available

### Option 2: Railway (Recommended for Backend)

#### Backend Deployment

1. **Connect GitHub Repository** at https://railway.app
2. **Add Service** → Select your repository
3. **Configure Environment Variables** in Railway dashboard
4. **Deploy** - Railway handles everything automatically

#### Advantages

- Easy PostgreSQL/Neo4j integration
- Environment variables management
- Automatic HTTPS
- GitHub integration for CI/CD

### Option 3: Docker Deployment

#### Frontend Dockerfile

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3030
CMD ["npm", "start"]
```

#### Backend Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3030:3030"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    ports:
      - "8000:8000"
    env_file:
      - backend/.env
    environment:
      - API_HOST=0.0.0.0
      - API_PORT=8000
```

### Option 4: Traditional VPS (DigitalOcean, AWS EC2, etc.)

1. **Provision Server** with Ubuntu 22.04 LTS
2. **Install Dependencies**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs python3.11 python3-pip nginx
   ```

3. **Clone Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/islamic-finance-workflows.git
   cd islamic-finance-workflows
   ```

4. **Set Up Frontend**:
   ```bash
   npm install
   npm run build
   ```

5. **Set Up Backend**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

6. **Configure Nginx** as reverse proxy
7. **Set Up PM2** for process management:
   ```bash
   npm install -g pm2
   pm2 start npm --name "frontend" -- start
   pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name "backend"
   pm2 startup
   pm2 save
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Run tests
        run: npm test
        continue-on-error: true

  deploy-frontend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

## ✔️ Post-Deployment Verification

### 1. Health Checks

```bash
# Frontend
curl https://your-frontend-domain.com

# Backend
curl https://your-backend-domain.com/health
```

### 2. API Connectivity

Test that frontend can reach backend:

```bash
curl https://your-backend-domain.com/api/templates
```

### 3. Service Dependencies

Verify external services:

- ✅ Neo4j connection
- ✅ Claude API access
- ✅ LlamaParse availability

### 4. Environment Variables

Confirm all required environment variables are set in production.

### 5. CORS Configuration

Ensure backend `CORS_ORIGINS` includes your frontend domain.

## 🔒 Security Best Practices

1. **Never commit sensitive data**:
   - API keys
   - Database passwords
   - Private keys

2. **Use environment variables** for all configuration

3. **Enable HTTPS** for production deployments

4. **Rotate API keys** regularly

5. **Implement rate limiting** on backend endpoints

6. **Set up monitoring**:
   - Error tracking (Sentry)
   - Performance monitoring (New Relic, DataDog)
   - Uptime monitoring (UptimeRobot, Pingdom)

## 🛠️ Troubleshooting

### Build Fails

```bash
# Clear caches
rm -rf node_modules .next
npm install
npm run build
```

### Backend Connection Issues

- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS configuration
- Ensure backend is running and accessible

### Neo4j Connection Errors

- Verify URI format: `neo4j+ssc://`
- Check firewall rules
- Confirm credentials are correct

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)

---

## 🤝 Developer Handoff Checklist

For handing off to other developers:

- [ ] Repository is on GitHub with proper access controls
- [ ] README.md is comprehensive
- [ ] CONTRIBUTING.md explains development workflow
- [ ] All environment variables documented in `.env.example`
- [ ] Dependencies are up to date and documented
- [ ] Deployment guide is complete
- [ ] Known issues are documented
- [ ] API documentation is available
- [ ] Architecture diagrams are included
- [ ] Contact information for support is provided

**Questions?** Open an issue in the GitHub repository or contact the development team.
