# Islamic Finance Workflows

A Next.js application demonstrating AI-powered workflows for Islamic finance compliance and document processing, powered by Claude AI and Model Context Protocol (MCP) integrations.

## 🌟 Features

- **AI-Powered Document Processing**: Intelligent PDF parsing and analysis using LlamaParse
- **Shariah Compliance Workflow**: Multi-step workflow for Islamic finance document validation
- **Knowledge Graph Integration**: Neo4j-powered knowledge management with Graphiti MCP
- **Real-time Processing**: Live execution monitoring with step-by-step feedback
- **MCP Integrations**: Extensible architecture using Model Context Protocol

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **Python** (v3.11 or higher)
- **npm** or **yarn** package manager

You'll also need accounts and API keys for:

- [Anthropic Claude API](https://console.anthropic.com/)
- [OpenAI API](https://platform.openai.com/api-keys)
- [LlamaParse](https://cloud.llamaindex.ai/)
- [Neo4j Aura](https://neo4j.com/cloud/aura/) (free tier available)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd islamic-finance-workflows
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env.local

# Edit .env.local and add your configuration
# The frontend runs on port 3030 by default
```

### 3. Backend Setup

```bash
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Copy environment configuration
cp .env.example .env

# Edit .env and add your API keys
```

### 4. Configure Environment Variables

#### Frontend (.env.local)

```env
PORT=3030
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Backend (backend/.env)

```env
# AI API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
LLAMAPARSE_API_KEY=your_llamaparse_api_key_here

# Neo4j Connection
NEO4J_URI=neo4j+ssc://your_instance_id.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password_here

# FastAPI Configuration
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3030,http://localhost:3000

# Claude Configuration
CLAUDE_MODEL=claude-sonnet-4-5-20250929
CLAUDE_MAX_TOKENS=16384
CLAUDE_TEMPERATURE=0.7
```

### 5. Start the Application

#### Terminal 1 - Backend API

```bash
cd backend
# Activate virtual environment if not already active
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Terminal 2 - Frontend

```bash
npm run dev
```

The application will be available at **http://localhost:3030**

## 🏗️ Project Structure

```
islamic-finance-workflows/
├── src/
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   └── workflow/           # Workflow-specific components
│   ├── lib/                    # Utility functions
│   └── types/                  # TypeScript type definitions
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── uploads/                # Document upload directory
│   └── outputs/                # Processing output directory
├── public/                     # Static assets
├── .env.example                # Frontend environment template
└── backend/.env.example        # Backend environment template
```

## 🛠️ Development

### Available Scripts

#### Frontend

- `npm run dev` - Start development server on port 3030
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

#### Backend

- `uvicorn main:app --reload` - Start FastAPI with auto-reload
- `pytest` - Run tests (if configured)

### Code Style

- Frontend: ESLint + Prettier (configured in project)
- Backend: PEP 8 Python style guide

## 🔧 Configuration

### MCP Integration

The application uses Model Context Protocol (MCP) for extensible AI integrations:

- **Graphiti MCP**: Knowledge graph management with Neo4j
- **Claude Code**: AI-powered workflow execution
- Custom MCP servers can be added via `.claude/claude_desktop_config.json`

### Neo4j Setup

1. Create a free Neo4j Aura instance at https://neo4j.com/cloud/aura/
2. Note your connection URI, username, and password
3. Add credentials to `backend/.env`
4. The Graphiti MCP will automatically initialize the required schema

## 📚 Workflows

### Shariah Compliance Workflow

1. **Source Connection**: Configure data source (file upload or database)
2. **Workflow Selection**: Choose Shariah compliance validation workflow
3. **Configuration**: Set analysis parameters and preferences
4. **Review & Execute**: Review configuration and start processing
5. **Live Execution**: Monitor real-time progress and results

## 🧪 Testing

### Frontend Testing

```bash
npm run test
```

### Backend Testing

```bash
cd backend
pytest
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

If port 3030 or 8000 is already in use:

```bash
# Check what's using the port (Windows)
netstat -ano | findstr :3030

# Check what's using the port (macOS/Linux)
lsof -i :3030

# Kill the process or change the port in .env.local
```

#### Backend Connection Errors

- Verify the backend is running on http://localhost:8000
- Check CORS_ORIGINS in `backend/.env` includes your frontend URL
- Ensure all API keys are valid and properly configured

#### Neo4j Connection Issues

- Verify Neo4j Aura instance is running
- Check firewall isn't blocking the connection
- Ensure URI includes the `neo4j+ssc://` protocol prefix

## 📖 Documentation

Additional documentation:

- [Developer Guide](./FOR_DEVELOPERS.md) - Detailed development guide
- [Architecture Overview](./PLUGGABLE_ARCHITECTURE.md) - System architecture
- [Quick Start Guide](./QUICK_START.md) - Quick setup guide
- [Deployment Guide](./NETLIFY_DEPLOYMENT_ASSESSMENT.md) - Deployment instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

[Add your license information here]

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Anthropic Claude](https://www.anthropic.com/)
- Knowledge graph with [Neo4j](https://neo4j.com/)
- MCP framework by Anthropic

## 📞 Support

For issues and questions:

- Create an issue in the GitHub repository
- Check existing documentation in the `/docs` folder
- Review [troubleshooting section](#-troubleshooting)

---

**Note**: This application is currently in development. Features and APIs may change.
