# ZeroH V2 GitHub Repository Setup Guide

**Document Version**: 1.0
**Date**: 2025-11-07
**Status**: Implementation Guide

---

## Overview

This guide provides step-by-step instructions for creating and configuring the new ZeroH V2 GitHub repository. The V2 project is a **complete separation** from the existing V1 codebase, designed as a production-ready frontend demo with mock services.

---

## Repository Naming

**Recommended Name**: `zeroh-v2`

**Naming Rationale**:
- Clear version separation from V1
- Lowercase with hyphen (GitHub convention)
- Concise and recognizable
- Available namespace check: https://github.com/your-org/zeroh-v2

**Alternative Names** (if primary unavailable):
- `zeroh-ai-native`
- `zeroh-grc-v2`
- `islamic-finance-grc-v2`

---

## Step 1: Create New Repository

### 1.1 Via GitHub Web Interface

1. Go to https://github.com/new
2. Configure repository settings:

```
Repository name: zeroh-v2
Description: AI-Native Blockchain-Anchored Islamic Finance GRC Platform - V2 Demo
Visibility:
  ☐ Public (if open-source strategy)
  ☑ Private (recommended for initial development)

Initialize repository:
  ☑ Add README.md
  ☑ Add .gitignore (Node template)
  ☐ Choose a license (TBD based on commercialization strategy)
```

3. Click **Create repository**

### 1.2 Via GitHub CLI (Alternative)

```bash
# Install GitHub CLI if not already installed
# Windows: winget install GitHub.cli
# macOS: brew install gh

# Authenticate
gh auth login

# Create repository
gh repo create zeroh-v2 \
  --private \
  --description "AI-Native Blockchain-Anchored Islamic Finance GRC Platform - V2 Demo" \
  --gitignore Node \
  --clone
```

---

## Step 2: Initial Repository Structure

### 2.1 Clone Repository Locally

```bash
# If created via web interface
git clone https://github.com/your-org/zeroh-v2.git
cd zeroh-v2
```

### 2.2 Create Branch Structure

```bash
# Create development branch
git checkout -b develop

# Create feature branch template
git checkout -b feature/initial-setup
```

**Branch Strategy**:
- `main` → Production-ready code (deployed to Netlify)
- `develop` → Integration branch for features
- `feature/*` → Individual feature branches
- `hotfix/*` → Emergency fixes for production

---

## Step 3: Setup Project Structure

### 3.1 Initialize Next.js Project

```bash
# From repository root
npx create-next-app@14.2.18 . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

# Note: Use "." for current directory, answer prompts:
# - TypeScript: Yes
# - ESLint: Yes
# - Tailwind CSS: Yes
# - App Router: Yes
# - Customize import alias: Yes (@/*)
```

### 3.2 Create Folder Structure

Based on `ZEROH_V2_PROJECT_BLUEPRINT.md`, create this structure:

```bash
# Create feature directories
mkdir -p src/features/{configuration,compliance,evidence,credentials}/{components,hooks,services,types,utils}

# Create lib directories
mkdir -p src/lib/{api,config,hooks,stores,constants}

# Create mock data directories
mkdir -p src/mocks/{data,handlers}

# Create contracts directory
mkdir -p contracts

# Create docs directory
mkdir -p docs/{architecture,api,user-guides}

# Create scripts directory
mkdir -p scripts

# Create public directories
mkdir -p public/{images,icons}
```

### 3.3 Create Essential Configuration Files

#### `.gitignore` (Extend Node template)
```bash
cat >> .gitignore << 'EOF'

# ZeroH V2 Specific
/out
/.vercel
/.netlify

# Environment variables
.env
.env.local
.env.development
.env.production

# Mock data (if contains sensitive test data)
# src/mocks/data/sensitive-*.ts

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
EOF
```

#### `.nvmrc` (Node version)
```bash
echo "20.11.0" > .nvmrc
```

#### `.node-version` (Alternative for some tools)
```bash
echo "20.11.0" > .node-version
```

---

## Step 4: Configure Package.json

### 4.1 Update Scripts

```json
{
  "name": "zeroh-v2",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3030",
    "build": "next build",
    "start": "next start -p 3030",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json,css,md}\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "analyze": "ANALYZE=true npm run build",
    "generate:api-types": "openapi-typescript contracts/api.yaml -o src/lib/api/generated-types.ts"
  }
}
```

### 4.2 Install Essential Dependencies

```bash
# Core dependencies (if not auto-installed)
npm install next@14.2.18 react@18.3 react-dom@18.3

# UI Components
npm install @radix-ui/react-accordion \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-select \
  @radix-ui/react-tabs \
  @radix-ui/react-toast \
  @radix-ui/react-tooltip \
  lucide-react \
  class-variance-authority \
  clsx \
  tailwind-merge

# State Management
npm install zustand

# Data Fetching
npm install @tanstack/react-query

# API Type Generation
npm install --save-dev openapi-typescript

# Forms
npm install react-hook-form zod @hookform/resolvers

# Utilities
npm install date-fns

# Development Tools
npm install --save-dev \
  typescript \
  @types/node \
  @types/react \
  @types/react-dom \
  eslint \
  eslint-config-next \
  prettier \
  prettier-plugin-tailwindcss
```

---

## Step 5: Configure TypeScript

### 5.1 Update `tsconfig.json`

```json
{
  "compilerConfig": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Step 6: Configure ESLint and Prettier

### 6.1 `.eslintrc.json`

```json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### 6.2 `.prettierrc.json`

```json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 100,
  "arrowParens": "always",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 6.3 `.prettierignore`

```
node_modules
.next
out
build
dist
coverage
*.config.js
```

---

## Step 7: Configure Next.js for Static Export

### 7.1 `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: false,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Disable server-side features for static export
  experimental: {
    serverActions: false,
  },
}

module.exports = nextConfig
```

---

## Step 8: Create Initial Documentation

### 8.1 `README.md`

```markdown
# ZeroH V2 - AI-Native Islamic Finance GRC Platform

**Version**: 0.1.0 (Demo)
**Status**: Development
**Deployment**: [Netlify URL will go here]

## Overview

ZeroH V2 is an AI-native, blockchain-anchored GRC (Governance, Risk, Compliance) platform for Islamic finance. This repository contains the frontend demo with realistic mock services.

### Key Features
- **Conversational Configuration**: 12-question intelligent setup (not 50-field forms)
- **5-Bucket Compliance Framework**: Shariah Governance, Regulatory & Legal, Risk Management, Financial & Reporting, Audit & Assurance
- **AI Agent Automation**: Automatic evidence collection and compliance monitoring
- **Blockchain Proof Layer**: Verifiable Credentials on Hedera HCS
- **Real-time Dashboard**: Live compliance tracking across all deals

## Technology Stack

- **Framework**: Next.js 14.2.18 (App Router, Static Export)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Deployment**: Netlify

## Quick Start

### Prerequisites
- Node.js 20.11.0 or higher
- npm 10.x or higher

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/zeroh-v2.git
cd zeroh-v2

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3030](http://localhost:3030) in your browser.

### Build for Production

```bash
# Create static export
npm run build

# Serve locally (optional)
npx serve out
```

## Project Structure

See [docs/architecture/PROJECT_STRUCTURE.md](docs/architecture/PROJECT_STRUCTURE.md) for detailed structure.

```
zeroh-v2/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── features/         # Feature-based organization
│   ├── components/       # Shared UI components
│   ├── lib/              # Utilities and services
│   └── mocks/            # Mock data and handlers
├── contracts/            # OpenAPI specifications
├── docs/                 # Documentation
└── public/               # Static assets
```

## Documentation

- [Architecture Overview](docs/architecture/OVERVIEW.md)
- [API Contracts](docs/api/README.md)
- [User Guide](docs/user-guides/GETTING_STARTED.md)
- [Contributing Guide](CONTRIBUTING.md)

## Key Concepts

### Mock-to-Real Pattern
This demo uses realistic mock services that match production API contracts. When the backend is ready, swap implementations:

```typescript
// Before (Mock)
import { conversationService } from '@/features/configuration/services'

// After (Real) - same interface, different implementation
// No frontend code changes needed!
```

### Feature-Based Organization
Code is organized by domain feature (not file type):
- `/features/configuration` - Deal configuration workflow
- `/features/compliance` - GRC dashboard and controls
- `/features/evidence` - Evidence repository
- `/features/credentials` - Verifiable Credentials

## Deployment

This project is configured for Netlify deployment:

```bash
# Build command
npm run build

# Publish directory
out
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

## Environment Variables

See [`.env.example`](.env.example) for required environment variables.

## Scripts

- `npm run dev` - Start development server (port 3030)
- `npm run build` - Build static export
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run type-check` - Run TypeScript compiler check
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run generate:api-types` - Generate TypeScript types from OpenAPI specs

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

[License TBD - Awaiting commercialization strategy decision]

## Support

For questions or issues:
- Create a GitHub issue
- Contact: [email TBD]
- Documentation: [docs site TBD]

---

**Built with ❤️ for the Islamic finance industry**
```

### 8.2 `.env.example`

```bash
# ==============================================
# ZeroH V2 Environment Configuration Template
# ==============================================
# Copy this file to .env.local for development
# Never commit .env.local to version control!

# -----------------------
# Application Mode
# -----------------------
# Set to "mock" for demo mode, "real" when backend is ready
NEXT_PUBLIC_API_MODE=mock

# -----------------------
# Backend API (for "real" mode)
# -----------------------
# NEXT_PUBLIC_API_URL=https://api.zeroh.io
# NEXT_PUBLIC_API_TIMEOUT=30000

# -----------------------
# Feature Flags
# -----------------------
# Enable/disable features during development
NEXT_PUBLIC_FEATURE_TOKENIZATION=false
NEXT_PUBLIC_FEATURE_SECONDARY_MARKET=false
NEXT_PUBLIC_FEATURE_PORTFOLIO_ANALYTICS=false

# -----------------------
# Analytics (Optional)
# -----------------------
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
# NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx

# -----------------------
# Development Tools
# -----------------------
# Show debug information in development
NEXT_PUBLIC_DEBUG=false
```

### 8.3 `CONTRIBUTING.md`

```markdown
# Contributing to ZeroH V2

Thank you for your interest in contributing to ZeroH V2!

## Development Workflow

### 1. Fork and Clone

```bash
git clone https://github.com/your-username/zeroh-v2.git
cd zeroh-v2
git remote add upstream https://github.com/original-org/zeroh-v2.git
```

### 2. Create Feature Branch

```bash
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Write clean, typed TypeScript code
- Follow existing code style (Prettier/ESLint)
- Add tests for new features
- Update documentation as needed

### 4. Commit Messages

Follow Conventional Commits format:

```
feat: add sustainability overlay configuration
fix: resolve control activation bug for cross-border deals
docs: update API contract documentation
refactor: improve service layer abstraction
test: add tests for 12-question MVQ
chore: update dependencies
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Create Pull Request on GitHub:
- Title: Clear description of changes
- Description: Reference issues, explain motivation
- Link related issues with "Fixes #123"

### 6. Code Review

- Address review comments
- Keep PR scope focused (small, incremental changes)
- Rebase on develop if needed

## Coding Standards

### TypeScript

- Use explicit types (avoid `any`)
- Prefer interfaces over types for object shapes
- Use enums for fixed value sets
- Export types alongside implementations

### React Components

```typescript
// Good: Typed props, documented component
interface DealCardProps {
  dealId: string
  dealName: string
  onSelect: (id: string) => void
}

/**
 * Displays deal summary card with compliance status
 */
export function DealCard({ dealId, dealName, onSelect }: DealCardProps) {
  // ...
}
```

### Service Layer

- Always define interface first
- Implement both mock and real versions
- Export via index.ts with runtime selection

```typescript
// services/conversationService.ts
export interface ConversationService {
  sendMessage(message: string): Promise<Response>
}

// services/conversationService.mock.ts
export class MockConversationService implements ConversationService {
  // ...
}

// services/index.ts
export const conversationService = config.useMockServices
  ? new MockConversationService()
  : new RealConversationService()
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Documentation

- Update README.md for user-facing changes
- Update architecture docs for structural changes
- Add inline comments for complex logic
- Update OpenAPI specs when changing API contracts

## Questions?

- Create a GitHub discussion
- Tag maintainers in PR for urgent questions

Thank you for contributing! 🎉
```

---

## Step 9: Copy Essential Files from V1

### 9.1 Copy Architecture Documentation

```bash
# From V1 repository root
cp ZEROH_V2_PROJECT_BLUEPRINT.md ../zeroh-v2/docs/architecture/
cp MICROSERVICE_ARCHITECTURE_BLUEPRINT.md ../zeroh-v2/docs/architecture/
cp ARCHITECTURE_SESSION_FINDINGS.md ../zeroh-v2/docs/architecture/
cp AI_NATIVE_GRC_POSITIONING.md ../zeroh-v2/docs/architecture/
cp AG_UI_CONVERSATIONAL_IMPLEMENTATION.md ../zeroh-v2/docs/architecture/
```

### 9.2 Copy Reusable Components (if applicable)

Only copy components that are relevant to V2:

```bash
# Example: Copy UI primitives (button, dialog, etc.)
# Review each component before copying - V2 may need redesigns
```

**Important**: Do NOT bulk copy from V1. V2 should be a clean slate. Only selectively port proven components.

---

## Step 10: Create Initial Commit

```bash
# Stage all files
git add .

# Create initial commit
git commit -m "chore: initial project setup with Next.js 14 and TypeScript

- Initialize Next.js 14.2.18 with App Router
- Configure TypeScript, ESLint, Prettier
- Setup project structure (features, lib, mocks)
- Add essential documentation (README, CONTRIBUTING)
- Configure static export for Netlify deployment
- Add environment configuration template

Related architecture docs:
- ZEROH_V2_PROJECT_BLUEPRINT.md
- MICROSERVICE_ARCHITECTURE_BLUEPRINT.md
- AI_NATIVE_GRC_POSITIONING.md"

# Push to remote
git push -u origin feature/initial-setup
```

---

## Step 11: Configure GitHub Settings

### 11.1 Branch Protection Rules

Navigate to **Settings → Branches → Branch protection rules**

**Protect `main` branch**:
```
Branch name pattern: main

☑ Require a pull request before merging
  ☑ Require approvals (1)
  ☐ Dismiss stale pull request approvals when new commits are pushed
  ☑ Require review from Code Owners

☑ Require status checks to pass before merging
  ☑ Require branches to be up to date before merging
  Status checks:
    - build
    - lint
    - type-check

☑ Require conversation resolution before merging

☑ Do not allow bypassing the above settings
```

**Protect `develop` branch**:
```
Branch name pattern: develop

☑ Require a pull request before merging
  ☑ Require approvals (1)

☑ Require status checks to pass before merging
  Status checks:
    - build
    - lint
```

### 11.2 Collaborators and Teams

Navigate to **Settings → Collaborators and teams**

```
Teams:
  @zeroh-core-team → Admin
  @zeroh-developers → Write
  @zeroh-designers → Triage (read + comment)
```

### 11.3 Repository Topics

Navigate to **Settings → General → Topics**

Add relevant topics:
```
islamic-finance
grc
compliance
blockchain
hedera
ai-native
nextjs
typescript
verifiable-credentials
shariah-compliance
```

### 11.4 Security Settings

Navigate to **Settings → Security → Code security and analysis**

```
☑ Dependency graph
☑ Dependabot alerts
☑ Dependabot security updates
☑ Grouped security updates
☑ Secret scanning
☑ Push protection
```

---

## Step 12: Setup GitHub Actions (CI/CD)

### 12.1 Create `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.11.0'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check code formatting
        run: npm run format:check

  type-check:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.11.0'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run TypeScript compiler
        run: npm run type-check

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.11.0'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/coverage-final.json
          fail_ci_if_error: false

  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.11.0'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build static export
        run: npm run build
        env:
          NEXT_PUBLIC_API_MODE: mock

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: out/
          retention-days: 7
```

### 12.2 Create `.github/workflows/deploy-preview.yml`

```yaml
name: Deploy Preview

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  deploy-preview:
    name: Deploy to Netlify Preview
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.11.0'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_MODE: mock

      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './out'
          production-deploy: false
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: 'Deploy from GitHub Actions (PR #${{ github.event.pull_request.number }})'
          enable-pull-request-comment: true
          enable-commit-comment: false
          overwrites-pull-request-comment: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        timeout-minutes: 5
```

### 12.3 Add GitHub Secrets

Navigate to **Settings → Secrets and variables → Actions**

Add the following secrets:
```
NETLIFY_AUTH_TOKEN → [Get from Netlify account settings]
NETLIFY_SITE_ID → [Get from Netlify site settings]
CODECOV_TOKEN → [Optional, for code coverage]
```

---

## Step 13: Create Project Board

### 13.1 Create GitHub Project

Navigate to **Projects → New project**

**Template**: Team backlog

**Columns**:
1. **Backlog** - Ideas and future work
2. **Ready** - Prioritized, ready to start
3. **In Progress** - Currently being worked on
4. **In Review** - Pull requests under review
5. **Done** - Completed work

### 13.2 Create Initial Issues

Create issues for V2 development phases:

**Phase 1: Foundation (Week 1)**
```markdown
Title: [Phase 1] Setup Project Foundation

Tasks:
- [ ] Initialize Next.js project
- [ ] Configure TypeScript, ESLint, Prettier
- [ ] Setup project structure
- [ ] Create documentation (README, CONTRIBUTING)
- [ ] Configure CI/CD with GitHub Actions
- [ ] Deploy initial version to Netlify

Labels: phase-1, infrastructure
Assignees: [team members]
```

**Phase 2: Configuration UI (Week 2-3)**
```markdown
Title: [Phase 2] Build Conversational Configuration UI

Tasks:
- [ ] Implement 12-question MVQ component
- [ ] Create conversation service (mock)
- [ ] Build control activation logic
- [ ] Design and implement configuration UI
- [ ] Add suggested response buttons
- [ ] Implement progress tracking

Labels: phase-2, feature, ui
Dependencies: #1 (Phase 1)
```

Continue creating issues for all phases...

---

## Step 14: Setup Documentation Site (Optional)

If using GitHub Pages or separate docs site:

### 14.1 Create `docs/` Branch

```bash
git checkout --orphan docs
git rm -rf .
echo "# ZeroH V2 Documentation" > README.md
git add README.md
git commit -m "docs: initialize documentation branch"
git push -u origin docs
```

### 14.2 Configure GitHub Pages

Navigate to **Settings → Pages**

```
Source: Deploy from a branch
Branch: docs / (root)
```

---

## Step 15: Team Collaboration Setup

### 15.1 Create `CODEOWNERS` File

```bash
cat > .github/CODEOWNERS << 'EOF'
# ZeroH V2 Code Owners
# These owners will be requested for review when someone opens a PR

# Global owners (all files)
* @your-org/zeroh-core-team

# Frontend architecture
/src/features/ @frontend-lead @architecture-lead
/src/lib/ @frontend-lead

# Mock services (require backend team review for realism)
/src/mocks/ @frontend-lead @backend-lead
/contracts/ @backend-lead @frontend-lead

# Documentation
/docs/ @architecture-lead
*.md @architecture-lead

# Configuration files
*.config.js @devops-lead
*.config.ts @devops-lead
.github/ @devops-lead
EOF
```

### 15.2 Create Issue Templates

Create `.github/ISSUE_TEMPLATE/`:

**Feature Request** (`.github/ISSUE_TEMPLATE/feature_request.md`):
```markdown
---
name: Feature Request
about: Suggest an idea for ZeroH V2
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Problem Statement
<!-- What problem does this feature solve? -->

## Proposed Solution
<!-- How should this feature work? -->

## Alternatives Considered
<!-- What other approaches did you consider? -->

## Additional Context
<!-- Screenshots, mockups, related issues -->
```

**Bug Report** (`.github/ISSUE_TEMPLATE/bug_report.md`):
```markdown
---
name: Bug Report
about: Report a bug in ZeroH V2
title: '[BUG] '
labels: bug
assignees: ''
---

## Description
<!-- Clear description of the bug -->

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
<!-- What should happen? -->

## Actual Behavior
<!-- What actually happened? -->

## Environment
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 20.11.0]
- Commit/Branch: [e.g., main@abc123]

## Screenshots
<!-- If applicable -->
```

---

## Step 16: Merge Initial Setup

### 16.1 Create Pull Request

```bash
# Push feature branch (if not already pushed)
git push -u origin feature/initial-setup

# Create PR via GitHub CLI
gh pr create \
  --title "chore: initial project setup" \
  --body "Complete initial setup for ZeroH V2 including Next.js, TypeScript, project structure, documentation, and CI/CD configuration." \
  --base develop \
  --label infrastructure
```

### 16.2 Review and Merge

1. Wait for CI checks to pass
2. Request review from team leads
3. Address review comments
4. Merge to `develop`

### 16.3 Create Release Branch (Optional)

```bash
git checkout develop
git pull origin develop
git checkout -b release/v0.1.0
git push -u origin release/v0.1.0
```

---

## Step 17: Communication and Handoff

### 17.1 Announce Repository

Send team notification:

```
Subject: ZeroH V2 Repository Ready 🚀

Team,

The new ZeroH V2 repository is now live and ready for development!

Repository: https://github.com/your-org/zeroh-v2
Documentation: https://github.com/your-org/zeroh-v2/tree/main/docs
Project Board: https://github.com/orgs/your-org/projects/X

Quick Start:
1. Clone: git clone https://github.com/your-org/zeroh-v2.git
2. Install: npm install
3. Run: npm run dev
4. Read: docs/architecture/OVERVIEW.md

Please review:
- CONTRIBUTING.md for development workflow
- PROJECT_STRUCTURE.md for code organization
- AI_NATIVE_GRC_POSITIONING.md for product vision

Next Steps:
- Phase 1 issues created in project board
- Feature branch strategy documented
- CI/CD configured and tested

Questions? Create a GitHub discussion or reach out to @architecture-lead.

Let's build something amazing! 💜
```

### 17.2 Update Stakeholder Documents

Update any external documentation, investor decks, or partner materials with:
- New repository URL
- Link to public demo (once deployed)
- Updated architecture diagrams

---

## Troubleshooting

### Issue: "Permission denied (publickey)"

```bash
# Check SSH key
ssh -T git@github.com

# If failed, add SSH key to GitHub account
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
# Copy output and add to GitHub → Settings → SSH Keys
```

### Issue: "Not authorized to push to this repository"

- Check repository permissions
- Verify you're pushing to correct remote
- Contact repository admin to grant write access

### Issue: "Merge conflict on initial setup"

```bash
# This shouldn't happen on fresh repo, but if it does:
git fetch origin
git rebase origin/develop
# Resolve conflicts
git rebase --continue
git push --force-with-lease origin feature/initial-setup
```

---

## Next Steps After Repository Setup

1. ✅ **Repository Created and Configured**
2. **Deploy to Netlify** → See `NETLIFY_DEPLOYMENT_GUIDE.md`
3. **Start Phase 1 Development** → Implement conversational configuration UI
4. **Setup Monitoring** → Analytics, error tracking, performance monitoring
5. **Invite Design Partners** → Share demo URL for feedback

---

## Checklist

Use this checklist to ensure all setup steps are complete:

### Repository Basics
- [ ] GitHub repository created (`zeroh-v2`)
- [ ] Repository cloned locally
- [ ] Branch strategy implemented (`main`, `develop`, `feature/*`)
- [ ] Next.js project initialized
- [ ] Project structure created (features, lib, mocks)

### Configuration
- [ ] TypeScript configured
- [ ] ESLint and Prettier configured
- [ ] Next.js static export configured
- [ ] Environment variables template created (`.env.example`)
- [ ] Git ignore configured

### Documentation
- [ ] README.md created
- [ ] CONTRIBUTING.md created
- [ ] Architecture docs copied from V1
- [ ] API contracts directory created
- [ ] User guides directory created

### GitHub Settings
- [ ] Branch protection rules configured
- [ ] Collaborators and teams added
- [ ] Repository topics added
- [ ] Security features enabled (Dependabot, secret scanning)
- [ ] CODEOWNERS file created
- [ ] Issue templates created

### CI/CD
- [ ] GitHub Actions workflows created (`ci.yml`, `deploy-preview.yml`)
- [ ] GitHub secrets added (Netlify tokens)
- [ ] Initial commit created
- [ ] Feature branch pushed
- [ ] Pull request created and merged

### Project Management
- [ ] GitHub Project board created
- [ ] Initial issues created (phases 1-4)
- [ ] Milestones created
- [ ] Team members assigned to issues

### Communication
- [ ] Team announcement sent
- [ ] Stakeholder documents updated
- [ ] Demo URL prepared (pending Netlify deployment)

---

## Support and Maintenance

### Regular Maintenance Tasks

**Weekly**:
- Review and merge Dependabot PRs
- Triage new issues
- Update project board

**Monthly**:
- Review and update documentation
- Audit dependencies for security vulnerabilities
- Clean up stale branches

**Quarterly**:
- Review and update branch protection rules
- Audit team permissions
- Update GitHub Actions workflows

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-07 | Claude | Initial GitHub repository setup guide |

---

**END OF GITHUB REPOSITORY SETUP GUIDE**

This guide provides complete instructions for setting up the ZeroH V2 GitHub repository. Follow each step carefully to ensure a production-ready, well-configured repository for the V2 project.
