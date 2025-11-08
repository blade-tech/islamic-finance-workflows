# ZeroH V2 Netlify Deployment Guide

**Document Version**: 1.0
**Date**: 2025-11-07
**Status**: Implementation Guide

---

## Overview

This guide provides complete instructions for deploying ZeroH V2 to Netlify. The application uses Next.js static export, making it fully compatible with Netlify's static hosting and CDN.

---

## Prerequisites

### 1. Netlify Account
- Create account at https://app.netlify.com/signup
- Free tier sufficient for demo/development
- Pro tier recommended for production ($19/month per member)

### 2. GitHub Repository
- ZeroH V2 repository created and configured
- Repository accessible to Netlify (public or private with OAuth)

### 3. Local Build Verification
```bash
# Verify build works locally
npm install
npm run build

# Verify output directory
ls -la out/  # Should contain static HTML, JS, CSS
```

---

## Part 1: Initial Netlify Setup

### Step 1: Create Netlify Site

#### Option A: Via Netlify UI (Recommended for First Deploy)

1. **Login to Netlify**
   - Navigate to https://app.netlify.com
   - Login with GitHub, GitLab, Bitbucket, or Email

2. **Import Project**
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **"GitHub"** as Git provider
   - Authorize Netlify to access your GitHub account
   - Select `zeroh-v2` repository

3. **Configure Build Settings**
   ```
   Site name: zeroh-v2-demo (or custom name)
   Branch to deploy: main
   Base directory: (leave empty)
   Build command: npm run build
   Publish directory: out
   ```

4. **Advanced Build Settings** (click "Show advanced")
   ```
   Environment variables:
     NEXT_PUBLIC_API_MODE = mock
     NODE_VERSION = 20.11.0
   ```

5. **Deploy Site**
   - Click **"Deploy site"**
   - Wait for initial build (2-5 minutes)
   - Site will be live at: `https://[random-name].netlify.app`

#### Option B: Via Netlify CLI (Alternative)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify site
cd /path/to/zeroh-v2
netlify init

# Follow prompts:
# - Create & configure a new site
# - Team: [Select your team]
# - Site name: zeroh-v2-demo
# - Build command: npm run build
# - Publish directory: out

# Manual deploy (optional, first time)
netlify deploy --prod
```

---

## Part 2: Configuration Files

### Step 1: Create `netlify.toml`

Create `netlify.toml` in repository root:

```toml
# ZeroH V2 Netlify Configuration
# https://docs.netlify.com/configure-builds/file-based-configuration/

[build]
  # Build command to execute
  command = "npm run build"

  # Directory with static assets to deploy
  publish = "out"

  # Functions directory (for future serverless functions)
  functions = "netlify/functions"

[build.environment]
  # Node.js version for builds
  NODE_VERSION = "20.11.0"

  # Application mode (mock for demo)
  NEXT_PUBLIC_API_MODE = "mock"

  # Disable telemetry during build
  NEXT_TELEMETRY_DISABLED = "1"

# Production context (main branch)
[context.production]
  command = "npm run build"

  [context.production.environment]
    NEXT_PUBLIC_API_MODE = "mock"
    NODE_ENV = "production"

# Deploy Preview context (PR deploys)
[context.deploy-preview]
  command = "npm run build"

  [context.deploy-preview.environment]
    NEXT_PUBLIC_API_MODE = "mock"
    NEXT_PUBLIC_DEBUG = "true"

# Branch deploy context (non-main branches)
[context.branch-deploy]
  command = "npm run build"

  [context.branch-deploy.environment]
    NEXT_PUBLIC_API_MODE = "mock"

# Redirects and rewrites
[[redirects]]
  # SPA fallback for client-side routing
  from = "/*"
  to = "/index.html"
  status = 200
  force = false

# Security headers
[[headers]]
  for = "/*"

  [headers.values]
    # Security headers
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

    # Content Security Policy (adjust as needed)
    Content-Security-Policy = """
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://api.zeroh.io;
      frame-ancestors 'self';
    """

    # Permissions Policy
    Permissions-Policy = """
      geolocation=(),
      microphone=(),
      camera=(),
      payment=(),
      usb=(),
      magnetometer=(),
      gyroscope=(),
      accelerometer=()
    """

# Cache control for static assets
[[headers]]
  for = "/static/*"

  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/_next/static/*"

  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Cache control for HTML (no cache for SPAs)
[[headers]]
  for = "/*.html"

  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

# Dev tools (disable for production)
[dev]
  command = "npm run dev"
  port = 3030
  targetPort = 3030
  autoLaunch = true
```

### Step 2: Create `_headers` File (Alternative to netlify.toml)

Create `public/_headers`:

```
# Security headers for all pages
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()

# Cache static assets forever (immutable)
/static/*
  Cache-Control: public, max-age=31536000, immutable

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

# Don't cache HTML
/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

### Step 3: Create `_redirects` File (Alternative to netlify.toml)

Create `public/_redirects`:

```
# SPA fallback for client-side routing
/*    /index.html    200

# Custom 404 page (optional)
# /*    /404.html    404
```

---

## Part 3: Environment Variables

### Step 1: Configure via Netlify UI

1. **Navigate to Site Settings**
   - Go to: `https://app.netlify.com/sites/[your-site-name]/settings/deploys`

2. **Add Environment Variables**
   - Click **"Environment variables"** in sidebar
   - Click **"Add a variable"**

**Required Variables**:
```
Key: NEXT_PUBLIC_API_MODE
Value: mock
Scopes: All scopes (Production, Deploy Previews, Branch deploys)

Key: NODE_VERSION
Value: 20.11.0
Scopes: All scopes

Key: NEXT_TELEMETRY_DISABLED
Value: 1
Scopes: All scopes
```

**Optional Variables** (for future use):
```
# When backend is ready
Key: NEXT_PUBLIC_API_URL
Value: https://api.zeroh.io
Scopes: Production only

# For development/staging
Key: NEXT_PUBLIC_API_URL
Value: https://api-staging.zeroh.io
Scopes: Deploy Previews, Branch deploys

# Debug mode for non-production
Key: NEXT_PUBLIC_DEBUG
Value: true
Scopes: Deploy Previews, Branch deploys only

# Analytics (when ready)
Key: NEXT_PUBLIC_GA_MEASUREMENT_ID
Value: G-XXXXXXXXXX
Scopes: Production only
```

### Step 2: Configure via Netlify CLI (Alternative)

```bash
# Set production environment variable
netlify env:set NEXT_PUBLIC_API_MODE mock

# Set for specific context
netlify env:set NEXT_PUBLIC_API_URL https://api.zeroh.io --context production

# List all environment variables
netlify env:list

# Import from .env file (use with caution)
netlify env:import .env.production
```

---

## Part 4: Deploy Contexts

Netlify supports three deploy contexts:

### 1. Production Deploys (main branch)
```
Branch: main
URL: https://zeroh-v2-demo.netlify.app
Triggers: Push to main, manual deploy
Environment: Production settings
```

### 2. Deploy Previews (Pull Requests)
```
Trigger: Pull request created/updated
URL: https://deploy-preview-[pr-number]--zeroh-v2-demo.netlify.app
Environment: Preview settings (can differ from production)
Auto-deploy: Yes (configurable)
```

### 3. Branch Deploys (Feature branches)
```
Trigger: Push to non-main branches (if enabled)
URL: https://[branch-name]--zeroh-v2-demo.netlify.app
Environment: Branch settings
Auto-deploy: Configure per branch
```

**Configure Deploy Contexts**:
1. Navigate to: `Site settings → Build & deploy → Deploy contexts`
2. Configure:
   ```
   Production branch: main
   Deploy Previews: Enabled (for all PRs)
   Branch deploys: Enabled (select branches or all)
   ```

---

## Part 5: Custom Domain Setup

### Step 1: Add Custom Domain

1. **Navigate to Domain Settings**
   - Go to: `Site settings → Domain management → Domains`

2. **Add Custom Domain**
   - Click **"Add custom domain"**
   - Enter: `demo.zeroh.io` (or your domain)
   - Click **"Verify"**

3. **Configure DNS**

**Option A: Netlify DNS (Recommended)**
- Transfer DNS management to Netlify
- Automatic SSL, fast propagation
- Steps:
  1. Add domain to Netlify
  2. Update nameservers at domain registrar to Netlify's
  3. Wait for DNS propagation (1-24 hours)

**Option B: External DNS**
- Keep existing DNS provider
- Add DNS records manually:

```
# For apex domain (zeroh.io)
Type: A
Name: @ (or blank)
Value: 75.2.60.5 (Netlify load balancer)

# For subdomain (demo.zeroh.io)
Type: CNAME
Name: demo
Value: [your-site-name].netlify.app

# Alternative apex configuration
Type: ALIAS or ANAME (if supported)
Name: @ (or blank)
Value: [your-site-name].netlify.app
```

### Step 2: Enable HTTPS

1. **Automatic HTTPS**
   - Netlify auto-provisions Let's Encrypt SSL
   - Usually takes 1-5 minutes after DNS propagation
   - Renews automatically every 90 days

2. **Force HTTPS**
   - Navigate to: `Site settings → Domain management → HTTPS`
   - Enable **"Force HTTPS"** (redirects HTTP → HTTPS)

3. **Verify SSL**
   ```bash
   # Check SSL certificate
   curl -I https://demo.zeroh.io

   # Should return:
   # HTTP/2 200
   # server: Netlify
   ```

---

## Part 6: Continuous Deployment

### Automatic Deploys from GitHub

**Already Configured** (if you used Netlify UI import):
- Push to `main` → Production deploy
- Open PR → Deploy Preview
- Push to feature branches → Branch deploy (if enabled)

### Manual Deploy

```bash
# Deploy draft (for testing)
netlify deploy

# Review draft at provided URL, then deploy to production
netlify deploy --prod

# Deploy with message
netlify deploy --prod --message "Release v1.0.0"
```

### Deploy via API

```bash
# Get site ID
SITE_ID=$(netlify sites:list --json | jq -r '.[0].id')

# Trigger deploy via API
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_NETLIFY_TOKEN" \
  "https://api.netlify.com/build_hooks/YOUR_HOOK_ID"
```

### Deploy Hooks (Webhook Triggers)

1. **Create Deploy Hook**
   - Navigate to: `Site settings → Build & deploy → Build hooks`
   - Click **"Add build hook"**
   - Name: "Manual Production Deploy"
   - Branch: main
   - Copy webhook URL

2. **Trigger Deploy**
   ```bash
   # Trigger via curl
   curl -X POST -d {} https://api.netlify.com/build_hooks/YOUR_HOOK_ID

   # Schedule with cron (if needed)
   # 0 2 * * * curl -X POST -d {} https://api.netlify.com/build_hooks/YOUR_HOOK_ID
   ```

---

## Part 7: Build Configuration

### Build Settings

Navigate to: `Site settings → Build & deploy → Build settings`

```
Base directory: (leave empty)
Build command: npm run build
Publish directory: out
Functions directory: netlify/functions
```

### Build Plugins

Install useful Netlify plugins:

1. **Essential Bundle Stats**
   ```bash
   netlify plugins:install netlify-plugin-essential-bundle-stats
   ```
   - Analyzes bundle size
   - Shows warnings for large bundles
   - No config needed

2. **Lighthouse Plugin**
   ```bash
   netlify plugins:install netlify-plugin-lighthouse
   ```
   - Runs Lighthouse on every deploy
   - Reports performance scores
   - Configure in `netlify.toml`:
   ```toml
   [[plugins]]
     package = "netlify-plugin-lighthouse"

     [plugins.inputs]
       output_path = "lighthouse-report"
   ```

3. **Checklinks Plugin**
   ```bash
   netlify plugins:install netlify-plugin-checklinks
   ```
   - Checks for broken links
   - Fails build if critical links broken
   - Configure in `netlify.toml`:
   ```toml
   [[plugins]]
     package = "netlify-plugin-checklinks"

     [plugins.inputs]
       checkExternal = true
       skipPatterns = ["/api/*"]
   ```

### Build Optimization

**1. Enable Asset Optimization**
   - Navigate to: `Site settings → Build & deploy → Post processing`
   - Enable:
     ```
     ☑ Bundle CSS
     ☑ Minify CSS
     ☑ Minify JS
     ☑ Compress images
     ☐ Pretty URLs (may conflict with Next.js routing)
     ```

**2. Configure Build Image**
   - Navigate to: `Site settings → Build & deploy → Build settings`
   - Build image: `Ubuntu Focal 20.04` (default, recommended)
   - Node version: `20.11.0` (set in environment variables)

**3. Increase Build Timeout (if needed)**
   - Default: 15 minutes (sufficient for Next.js)
   - Increase if using heavy image processing or large builds
   - Navigate to: `Site settings → Build & deploy → Build settings`

---

## Part 8: Monitoring and Analytics

### Netlify Analytics (Optional - $9/month)

1. **Enable Netlify Analytics**
   - Navigate to: `Site settings → Analytics`
   - Click **"Enable Netlify Analytics"**

2. **Features**:
   - Server-side analytics (no cookies, GDPR-friendly)
   - Page views, unique visitors
   - Top pages, referrers, locations
   - No JavaScript required

### External Analytics Integration

**Google Analytics 4**:
```typescript
// src/app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  )
}
```

**PostHog** (Product Analytics):
```typescript
// src/lib/analytics.ts
import posthog from 'posthog-js'

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: 'https://app.posthog.com',
  })
}
```

### Error Tracking

**Sentry Integration**:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Configure in `.env.production`:
```env
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=xxx
```

---

## Part 9: Performance Optimization

### Edge CDN Configuration

Netlify automatically distributes your site via Edge CDN (no config needed).

**Manual Cache Control** (already in netlify.toml):
```toml
# Immutable assets (JS, CSS, images in /_next/static/)
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# HTML (no cache, always fresh)
[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

### Prerendering

If using dynamic routes in future:
```toml
[build]
  command = "npm run build"
  publish = "out"

# Prerender specific pages
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Image Optimization

For production, consider:
1. **Next.js Image Optimization** (requires Image Optimization API)
2. **Cloudinary** (external service)
3. **Netlify Large Media** (Git LFS-based)

---

## Part 10: Forms and Serverless Functions (Future)

### Netlify Forms (if needed)

```html
<!-- Add to any HTML form -->
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <input type="email" name="email" required />
  <button type="submit">Submit</button>
</form>
```

Configure notifications:
- Navigate to: `Site settings → Forms → Form notifications`
- Add email/Slack/webhook notifications

### Netlify Functions (Serverless)

Create `netlify/functions/hello.ts`:

```typescript
import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Netlify Functions!' }),
  }
}
```

Access at: `https://your-site.netlify.app/.netlify/functions/hello`

---

## Part 11: Rollbacks and Versioning

### Instant Rollbacks

1. **View Deploy History**
   - Navigate to: `Deploys` tab
   - See all previous deploys with commit info

2. **Rollback to Previous Deploy**
   - Click on any previous deploy
   - Click **"Publish deploy"**
   - Site instantly reverts to that version

### Atomic Deploys

Netlify deploys are atomic:
- New version uploaded completely before going live
- No partial deploys (all-or-nothing)
- Zero downtime during deploys

---

## Part 12: Branch-Based Deploys

### Configure Branch Deploys

1. **Enable Branch Deploys**
   - Navigate to: `Site settings → Build & deploy → Deploy contexts`
   - Branch deploys: **"All branches"** or **"Let me add individual branches"**

2. **Add Specific Branches** (if selective)
   ```
   develop
   staging
   feature/*
   ```

3. **Branch Deploy URLs**
   ```
   https://develop--zeroh-v2-demo.netlify.app
   https://staging--zeroh-v2-demo.netlify.app
   https://feature-auth--zeroh-v2-demo.netlify.app
   ```

### Branch Subdomains (Pro Feature)

For production-like branch URLs:
```
develop.zeroh.io → develop branch
staging.zeroh.io → staging branch
```

Configure:
1. Upgrade to Pro plan
2. Navigate to: `Site settings → Domain management → Branch subdomains`
3. Enable and configure DNS

---

## Part 13: Security Best Practices

### 1. Environment Variable Security

**DO**:
- Store secrets in Netlify environment variables (encrypted at rest)
- Use different values for production vs preview
- Prefix public variables with `NEXT_PUBLIC_`

**DON'T**:
- Commit secrets to Git
- Use same API keys for all environments
- Expose backend tokens to frontend

### 2. Content Security Policy

Already configured in `netlify.toml`. Adjust as needed:

```toml
Content-Security-Policy = """
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.zeroh.io https://analytics.google.com;
"""
```

### 3. Access Control (Pro Feature)

For private demos:
1. Navigate to: `Site settings → Access control`
2. Enable password protection or JWT-based auth
3. Set password for entire site or specific paths

### 4. Webhook Security

Verify webhook signatures:
```typescript
import crypto from 'crypto'

function verifyNetlifyWebhook(body: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(body)
  const digest = hmac.digest('hex')
  return digest === signature
}
```

---

## Part 14: Troubleshooting

### Issue: Build Fails

**1. Check Build Logs**
```
Navigate to: Deploys → [Failed deploy] → Deploy log
Look for errors in:
- Dependency installation
- Build command execution
- File permissions
```

**2. Common Causes**:
```bash
# Missing dependencies
Error: Cannot find module 'X'
Fix: npm install X --save

# Node version mismatch
Error: Unsupported engine
Fix: Set NODE_VERSION in environment variables

# Out of memory
Error: JavaScript heap out of memory
Fix: Increase Node memory in build command
Build command: NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

**3. Test Locally**:
```bash
# Clean build
rm -rf node_modules .next out
npm install
npm run build

# If works locally but fails on Netlify:
# - Check environment variables
# - Check Node version (should match local)
# - Check for file path case sensitivity
```

### Issue: 404 on Page Refresh

**Cause**: SPA routing not configured

**Fix**: Add to `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Or create `public/_redirects`:
```
/*    /index.html    200
```

### Issue: Environment Variables Not Working

**Symptoms**: `process.env.NEXT_PUBLIC_X` is `undefined`

**Fixes**:
1. **Check Variable Name**:
   - Must start with `NEXT_PUBLIC_` for client-side access
   - Case-sensitive

2. **Rebuild After Adding Variables**:
   - Environment variables only applied during build
   - Trigger new deploy after adding variables

3. **Check Context**:
   - Verify variable enabled for correct deploy context
   - Production variables won't apply to preview deploys

### Issue: Slow Build Times

**Causes and Fixes**:

1. **Large Dependencies**:
   ```bash
   # Analyze bundle
   npm run analyze

   # Remove unused dependencies
   npm prune
   ```

2. **No Dependency Caching**:
   - Netlify automatically caches `node_modules`
   - Clear cache if corrupted: Settings → Build & deploy → Clear cache

3. **Heavy Image Processing**:
   - Optimize images before commit
   - Use external image CDN (Cloudinary, Imgix)

### Issue: CORS Errors

**Cause**: API requests blocked by CORS policy

**Fix** (when backend is ready):
```toml
# Add CORS headers to API routes
[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "https://demo.zeroh.io"
    Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type, Authorization"
```

Or configure CORS on backend API server.

### Issue: Deploy Takes Too Long

**Expected Times**:
- First deploy: 3-5 minutes (install all dependencies)
- Subsequent deploys: 1-3 minutes (cached dependencies)

**If longer**:
1. Check build logs for hanging processes
2. Reduce bundle size
3. Disable heavy post-processing
4. Contact Netlify support if consistently > 10 minutes

---

## Part 15: Netlify CLI Reference

### Installation

```bash
npm install -g netlify-cli
```

### Common Commands

```bash
# Login to Netlify
netlify login

# Initialize site (links local repo to Netlify site)
netlify init

# Link to existing site
netlify link

# Get site info
netlify status

# List all sites
netlify sites:list

# Open site in browser
netlify open

# Deploy to draft URL (testing)
netlify deploy

# Deploy to production
netlify deploy --prod

# Open deploy logs in browser
netlify open:admin

# Local development server (proxies Netlify environment)
netlify dev

# Run functions locally
netlify functions:serve

# Environment variables
netlify env:list
netlify env:set KEY value
netlify env:get KEY
netlify env:unset KEY

# Build locally with Netlify build environment
netlify build

# Trigger deploy via build hook
netlify deploy --trigger

# Unlock deploy (if stuck)
netlify deploy --unlock
```

---

## Part 16: Cost Estimation

### Free Tier (Starter)
```
✅ 100 GB bandwidth/month
✅ 300 build minutes/month
✅ 1 concurrent build
✅ Netlify DNS
✅ Automatic HTTPS
✅ Deploy previews
✅ Form submissions (100/month)
✅ Serverless functions (125k invocations/month)

Sufficient for: Demo, MVP, low-traffic production
```

### Pro Tier ($19/month per member)
```
Everything in Free, plus:
✅ 1 TB bandwidth/month
✅ 1000 build minutes/month
✅ 3 concurrent builds
✅ Password protection
✅ Branch subdomains
✅ Background functions
✅ Form submissions (1000/month)

Recommended for: Production, multiple team members
```

### Business Tier ($99/month per member)
```
Everything in Pro, plus:
✅ SSO (SAML)
✅ Role-based access control
✅ Advanced security (HIPAA, SOC 2)
✅ 24/7 support
✅ 99.99% uptime SLA

Recommended for: Enterprise, regulated industries
```

**Overage Pricing**:
```
Bandwidth: $20 per 100 GB
Build minutes: $7 per 500 minutes
Form submissions: $19 per 1000 submissions
```

---

## Part 17: Post-Deployment Checklist

### Immediate After First Deploy

- [ ] Site deployed successfully
- [ ] Accessible at Netlify URL (`https://[site-name].netlify.app`)
- [ ] All pages load without errors
- [ ] Navigation works (test multiple routes)
- [ ] Environment variables applied correctly
- [ ] Build logs show no warnings

### Custom Domain Setup (if applicable)

- [ ] Custom domain added to Netlify
- [ ] DNS records configured
- [ ] DNS propagation complete (check with `dig demo.zeroh.io`)
- [ ] HTTPS certificate provisioned
- [ ] Force HTTPS enabled
- [ ] Site accessible via custom domain

### Performance and Security

- [ ] Lighthouse score > 90 (run via Chrome DevTools)
- [ ] Security headers configured (check with https://securityheaders.com)
- [ ] Images optimized
- [ ] Bundle size reasonable (< 1 MB initial load)
- [ ] Cache headers configured for static assets

### CI/CD and Automation

- [ ] GitHub integration working
- [ ] Push to main triggers production deploy
- [ ] Pull requests trigger deploy previews
- [ ] Build status badges added to README (optional)
- [ ] Deploy notifications configured (Slack, email)

### Monitoring

- [ ] Analytics configured (Netlify or Google Analytics)
- [ ] Error tracking configured (Sentry or similar)
- [ ] Uptime monitoring configured (UptimeRobot, Pingdom)
- [ ] Deploy notifications enabled

### Documentation

- [ ] Update README with live demo URL
- [ ] Add deployment status badge
- [ ] Document environment variables
- [ ] Update architecture docs with deployment info

---

## Part 18: Maintenance and Updates

### Weekly Tasks

- [ ] Review deploy logs for errors
- [ ] Check analytics for traffic patterns
- [ ] Review and merge Dependabot PRs

### Monthly Tasks

- [ ] Review bandwidth usage
- [ ] Audit environment variables
- [ ] Test disaster recovery (rollback)
- [ ] Update dependencies

### Quarterly Tasks

- [ ] Review Netlify plan (upgrade if needed)
- [ ] Audit security headers
- [ ] Performance audit (Lighthouse, Core Web Vitals)
- [ ] Cost optimization review

---

## Part 19: Advanced Features (Future)

### Incremental Static Regeneration (ISR)

When backend is ready, enable ISR with `@netlify/plugin-nextjs`:

```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

This enables:
- On-demand revalidation
- Stale-while-revalidate
- Dynamic routes with static generation

### A/B Testing (Split Testing)

Configure split tests in `netlify.toml`:

```toml
[[edge_functions]]
  function = "split-test"
  path = "/*"

[context.branch-deploy.environment]
  SPLIT_TEST_ENABLED = "true"
```

### Geolocation Redirects

Redirect based on visitor country:

```toml
[[redirects]]
  from = "/en"
  to = "/en-us"
  status = 200
  conditions = {Country = ["US"]}

[[redirects]]
  from = "/en"
  to = "/en-gb"
  status = 200
  conditions = {Country = ["GB"]}
```

---

## Appendix A: Sample Deploy Output

```
9:12:03 AM: Build ready to start
9:12:05 AM: build-image version: 12345abcdef
9:12:05 AM: buildbot version: 1.2.3
9:12:05 AM: Fetching cached dependencies
9:12:07 AM: Starting to download cache of 142.3MB
9:12:09 AM: Finished downloading cache in 2.1s
9:12:09 AM: Starting build script
9:12:09 AM: Installing dependencies
9:12:09 AM: Python version set to 3.8
9:12:10 AM: Downloading and installing node v20.11.0...
9:12:12 AM: npm install
9:12:35 AM: added 387 packages in 23s
9:12:35 AM: npm run build
9:12:36 AM: > zeroh-v2@0.1.0 build
9:12:36 AM: > next build
9:12:37 AM: info  - Linting and checking validity of types...
9:12:45 AM: info  - Creating an optimized production build...
9:13:12 AM: info  - Compiled successfully
9:13:12 AM: info  - Collecting page data...
9:13:15 AM: info  - Generating static pages (0/12)
9:13:18 AM: info  - Generating static pages (3/12)
9:13:20 AM: info  - Generating static pages (6/12)
9:13:22 AM: info  - Generating static pages (9/12)
9:13:24 AM: info  - Generating static pages (12/12)
9:13:24 AM: info  - Finalizing page optimization...
9:13:25 AM: Build complete!
9:13:26 AM: Deploying to Netlify Edge CDN...
9:13:45 AM: Site is live ✨
9:13:45 AM: https://[random-name].netlify.app
```

---

## Appendix B: Emergency Procedures

### Site Down

1. **Check Netlify Status**: https://www.netlifystatus.com
2. **Rollback to Previous Version**:
   ```bash
   netlify open:admin
   # Click "Deploys" → Select previous deploy → "Publish deploy"
   ```
3. **Notify Team**: Post in Slack/Discord

### Build Breaking

1. **Identify Breaking Commit**:
   ```bash
   git log --oneline main
   ```
2. **Revert Commit**:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
3. **Manual Rollback** (alternative):
   - Netlify UI → Deploys → Last successful deploy → Publish

### DNS Issues

1. **Verify DNS Records**:
   ```bash
   dig demo.zeroh.io
   nslookup demo.zeroh.io
   ```
2. **Check Netlify DNS Dashboard**
3. **Contact Domain Registrar** if external DNS

---

## Support Resources

### Official Documentation
- Netlify Docs: https://docs.netlify.com
- Next.js Deployment: https://nextjs.org/docs/deployment

### Community Support
- Netlify Community: https://answers.netlify.com
- Discord: https://discord.gg/netlify
- Twitter: @Netlify

### Enterprise Support
- Email: support@netlify.com (Pro/Business plans)
- Priority support: Available 24/7 for Business plans

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-07 | Claude | Initial Netlify deployment guide |

---

**END OF NETLIFY DEPLOYMENT GUIDE**

This comprehensive guide covers everything needed to deploy ZeroH V2 to Netlify, from initial setup to advanced configuration and troubleshooting. Follow the steps sequentially for a successful production deployment.
