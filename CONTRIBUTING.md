# Contributing to Islamic Finance Workflows

Thank you for your interest in contributing to the Islamic Finance Workflows project! This document provides guidelines and best practices for contributing.

## 🚀 Getting Started

1. **Fork the Repository**: Click the "Fork" button at the top of the repository
2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/islamic-finance-workflows.git
   cd islamic-finance-workflows
   ```
3. **Add Upstream Remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/islamic-finance-workflows.git
   ```
4. **Set Up Development Environment**: Follow the setup instructions in [README.md](./README.md)

## 🌿 Branch Naming Convention

Use descriptive branch names that follow this pattern:

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Urgent fixes for production
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates
- `test/description` - Test additions or updates

Examples:
```bash
git checkout -b feature/add-sukuk-validation
git checkout -b bugfix/fix-pdf-parsing-error
git checkout -b docs/update-api-documentation
```

## 💻 Development Workflow

### 1. Keep Your Fork Updated

Before starting work, sync with upstream:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes

- Write clean, readable code
- Follow existing code style and conventions
- Add comments for complex logic
- Update tests as needed

### 4. Test Your Changes

#### Frontend
```bash
npm run lint
npm run build
npm run test
```

#### Backend
```bash
cd backend
pytest
python -m flake8 .
```

### 5. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add Sukuk validation workflow"
```

#### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add Mudarabah contract analyzer
fix: resolve PDF parsing timeout issue
docs: update API endpoint documentation
refactor: improve error handling in workflow service
test: add unit tests for compliance validation
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the PR template (see below)
4. Submit the pull request

## 📝 Pull Request Guidelines

### PR Title Format

Use the same format as commit messages:
```
feat: Add Sukuk validation workflow
fix: Resolve Neo4j connection timeout
docs: Update deployment guide
```

### PR Description Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran and how to reproduce them

## Checklist
- [ ] My code follows the project's code style
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Related Issues
Closes #123
```

## 🎨 Code Style Guidelines

### TypeScript/React (Frontend)

- Use TypeScript for type safety
- Follow React best practices and hooks guidelines
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable and function names
- Extract reusable logic into custom hooks

```typescript
// Good
const useFetchDocuments = (workflowId: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  // ... implementation
  return { documents, loading, error };
};

// Component
export const DocumentList: React.FC<Props> = ({ workflowId }) => {
  const { documents, loading } = useFetchDocuments(workflowId);
  // ... render
};
```

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints for function parameters and return values
- Write docstrings for functions and classes
- Keep functions small and focused
- Use meaningful variable names

```python
# Good
def validate_shariah_compliance(
    document: Document,
    rules: List[ComplianceRule]
) -> ValidationResult:
    """
    Validate document against Shariah compliance rules.

    Args:
        document: The document to validate
        rules: List of compliance rules to check

    Returns:
        ValidationResult containing compliance status and details
    """
    # ... implementation
```

## 🧪 Testing Guidelines

### Frontend Tests

- Write unit tests for utility functions
- Write integration tests for components
- Test edge cases and error states
- Aim for >80% code coverage

### Backend Tests

- Write unit tests for business logic
- Write integration tests for API endpoints
- Test error handling and edge cases
- Mock external dependencies (APIs, databases)

## 📚 Documentation

When adding new features:

1. Update the main README.md if needed
2. Add inline code comments for complex logic
3. Update API documentation for new endpoints
4. Add examples and usage instructions
5. Update relevant .md files in the project

## 🔍 Code Review Process

### What We Look For

- **Correctness**: Does the code do what it's supposed to do?
- **Testing**: Are there appropriate tests?
- **Style**: Does it follow our style guidelines?
- **Documentation**: Is it well-documented?
- **Performance**: Are there any performance concerns?
- **Security**: Are there any security vulnerabilities?

### Addressing Review Feedback

- Be open to feedback and suggestions
- Respond to all comments
- Make requested changes in new commits
- Push updates to the same branch
- Request re-review when ready

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues to avoid duplicates
2. Test with the latest version
3. Gather relevant information

### Bug Report Template

```markdown
## Bug Description
Clear and concise description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Screenshots
If applicable, add screenshots

## Environment
- OS: [e.g., Windows 10, macOS 14.0]
- Browser: [e.g., Chrome 120, Firefox 121]
- Node Version: [e.g., 20.10.0]
- Python Version: [e.g., 3.11.5]

## Additional Context
Any other relevant information
```

## ✨ Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear and concise description of the feature

## Problem It Solves
Explain the problem this feature would solve

## Proposed Solution
Describe your proposed solution

## Alternative Solutions
Describe any alternative solutions considered

## Additional Context
Any other relevant information, mockups, or examples
```

## 🤝 Community Guidelines

- Be respectful and professional
- Provide constructive feedback
- Help others when you can
- Follow the [Code of Conduct](./CODE_OF_CONDUCT.md)

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's license.

## 🙋 Questions?

If you have questions about contributing:

1. Check this document first
2. Review existing issues and discussions
3. Create a new issue with the "question" label
4. Reach out to maintainers

---

Thank you for contributing to Islamic Finance Workflows! 🎉
