# Islamic Finance Workflows

**AI-powered AAOIFI-compliant document generation with blockchain deployment**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.18-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Hedera](https://img.shields.io/badge/Hedera-Guardian-purple)](https://www.hedera.com/guardian)

---

## What This Does

Islamic Finance Workflows is a **modular, component-based configuration system** for structuring compliant Islamic finance deals and deploying them to blockchain.

### 10-Step Workflow

1. **Connect Sources** - Initialize backend and knowledge graph
2. **Select Shariah Structure** - Choose contract type (Wakala, Murabaha, Ijarah, etc.)
3. **Select Jurisdiction** - Choose regulatory framework (Qatar QFC, UAE DIFC, etc.)
4. **Select Accounting** - Choose standards (AAOIFI, IFRS, GAAP)
5. **Select Impact Metrics** - Choose ESG frameworks (QFC Sustainable, UN SDGs, etc.)
6. **Review Configuration** - Validate component compatibility
7. **Configure Details** - Fill deal parameters and upload documents
8. **Review Policy Structure** - View Guardian policy and BPMN workflow
9. **Test Workflow** - Run sandbox simulation
10. **Live Execution** - Deploy to Hedera Guardian blockchain

### Pre-Configured Demo: QIIB Oryx Sustainability Sukuk

The app includes a one-click demo representing a Qatar Islamic Bank sustainability Sukuk:
- **Shariah Structure**: Wakala (Agency) with Sukuk securitization
- **Jurisdiction**: Qatar Financial Centre (QFC)
- **Accounting**: AAOIFI standards
- **Impact Metrics**: QFC Sustainable Finance + Islamic Social Finance
- **Mock Deployment**: Realistic blockchain transaction IDs and DIDs

---

## Quick Start

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Blade-Labs/islamic-finance-workflows.git
cd islamic-finance-workflows
```

### 2. One-Command Demo Launch

**Windows**:
```bash
start-demo.bat
```

**Mac/Linux**:
```bash
chmod +x start-demo.sh
./start-demo.sh
```

This will:
- Install dependencies (first run only)
- Start backend API on port 8000
- Start frontend dev server on port 3040
- Open browser to http://localhost:3040

### 3. Manual Setup (Optional)

If you prefer manual setup:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
cd ..
```

### 4. Start Manually (Optional)

**Terminal 1 - Backend**:
```bash
cd backend
# Activate venv if not already active
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Frontend**:
```bash
npm run dev
```

The application will be available at **http://localhost:3040**

## 🏗️ Project Structure

```
islamic-finance-workflows/
├── src/
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui reusable components
│   │   └── workflow/           # 10-step workflow components
│   ├── lib/                    # Utility functions & validation
│   ├── types/                  # TypeScript type definitions
│   └── data/                   # Component configurations (Shariah, Jurisdictions, etc.)
├── backend/
│   └── app/
│       ├── main.py             # FastAPI application
│       ├── models/             # Pydantic data models
│       └── services/           # Guardian policy generation
├── public/                     # Static assets
├── start-demo.bat              # Windows demo launcher
├── start-demo.sh               # Mac/Linux demo launcher
└── PROJECT_OVERVIEW.md         # Comprehensive documentation
```

## 🛠️ Development

### Available Scripts

#### Frontend

- `npm run dev` - Start development server on port 3040
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

#### Backend

- `uvicorn app.main:app --reload` - Start FastAPI with auto-reload (from backend/ directory)

### Code Style

- Frontend: ESLint + Prettier (configured in project)
- Backend: PEP 8 Python style guide

## 📚 Using the Demo

### QIIB Oryx Sustainability Sukuk Workflow

1. **Launch Demo** - Use `start-demo.bat` (Windows) or `start-demo.sh` (Mac/Linux)
2. **Click "Load QIIB Oryx Demo"** - Pre-populates all 4 components
3. **Review Configuration** - See Wakala + QFC + AAOIFI + Sustainability metrics
4. **Step Through Workflow** - Navigate through all 10 steps
5. **View Guardian Policy** - See generated BPMN workflow and policy structure
6. **Mock Deployment** - Simulated blockchain deployment with realistic transaction IDs

**Note**: Phase 1 uses mock implementations for Guardian integration. Real blockchain deployment coming in Phase 2.

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

If port 3040 or 8000 is already in use:

```bash
# Windows - Check what's using the port
netstat -ano | findstr :3040

# Windows - Kill process
taskkill /F /PID <process_id>

# Mac/Linux - Check what's using the port
lsof -i :3040

# Mac/Linux - Kill process
kill <process_id>
```

#### Backend Connection Errors

- Verify the backend is running on http://localhost:8000
- Check backend logs for errors
- Ensure Python virtual environment is activated

#### Demo Not Loading

- Clear browser cache and refresh
- Check browser console for errors
- Verify both frontend and backend servers are running

## 📖 Documentation

**Comprehensive Documentation**:
- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Complete documentation with demo details, architecture, known gaps, and future roadmap

**Additional Resources**:
- [Known Gaps](./KNOWN_GAPS.md) - Current limitations and future work
- [Developer Guide](./FOR_DEVELOPERS.md) - Detailed development guide
- [Architecture Overview](./PLUGGABLE_ARCHITECTURE.md) - System architecture
- [Deployment Assessment](./NETLIFY_DEPLOYMENT_ASSESSMENT.md) - Deployment considerations

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
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- BPMN visualization with [bpmn-js](https://bpmn.io/)
- Blockchain framework: [Hedera Guardian](https://www.hedera.com/guardian)

## 📞 Support

For issues and questions:

- Create an issue in the [GitHub repository](https://github.com/Blade-Labs/islamic-finance-workflows/issues)
- Check [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for comprehensive documentation
- Review [troubleshooting section](#-troubleshooting)

---

**Phase 1 Status**: This demo showcases the modular workflow architecture with mock Guardian integration. Real blockchain deployment and live Hedera Guardian integration coming in Phase 2.
