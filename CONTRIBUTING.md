# Contributing to K6 Test Framework

Thank you for your interest in contributing to this k6 performance testing framework! 🎉

## 🤝 How to Contribute

### 1. **Reporting Issues**
- Use GitHub Issues to report bugs or suggest features
- Include detailed steps to reproduce issues
- Provide k6 version and system information

### 2. **Adding New Tests**
- Follow the existing test structure in `tests/`
- Add tests for new APIs or scenarios
- Include proper documentation and comments

### 3. **Improving Documentation**
- Update `docs/` for new features
- Fix typos or improve clarity
- Add examples for complex scenarios

### 4. **Dashboard Enhancements**
- Improve Grafana dashboards in `dashboards/`
- Add new metrics or visualizations
- Ensure compatibility with different k6 versions

## 🛠️ Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/k6-test-framework.git
   cd k6-test-framework
   ```

2. **Install Dependencies**
   ```bash
   npm install
   chmod +x scripts/*.sh
   ```

3. **Run Tests**
   ```bash
   npm run test:smoke
   ```

## 📝 Pull Request Guidelines

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow existing patterns**
   - Use similar naming conventions
   - Follow TypeScript/JavaScript style
   - Add appropriate comments

3. **Test your changes**
   - Run existing tests
   - Add new tests if needed
   - Verify documentation updates

4. **Create PR**
   - Clear title and description
   - Link related issues
   - Include test results if applicable

## 🎯 Areas for Contribution

### **High Priority**
- [ ] Add more public API examples
- [ ] Improve error handling in tests  
- [ ] Add performance regression testing
- [ ] Create more Grafana dashboard variants

### **Medium Priority**
- [ ] Add WebSocket testing examples
- [ ] Enhance CI/CD workflows
- [ ] Add test data management utilities
- [ ] Create performance comparison tools

### **Nice to Have**
- [ ] Add more output format options
- [ ] Create test result analysis scripts
- [ ] Add integration with other tools
- [ ] Performance optimization guides

## 🏷️ Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `api`: Related to API testing
- `dashboard`: Grafana dashboard related
- `ci/cd`: GitHub Actions workflows

## 📋 Code Style

- **JavaScript/TypeScript**: Follow ESLint configuration
- **Documentation**: Use clear, concise language
- **Commits**: Use conventional commit format
- **Variables**: Use descriptive names
- **Comments**: Explain complex logic

## 🤔 Questions?

- Open a GitHub Discussion
- Check existing issues
- Review documentation in `docs/`

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make this k6 testing framework better for everyone! 🚀
