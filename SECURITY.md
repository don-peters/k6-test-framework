# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ |

## Reporting a Vulnerability

If you discover a security vulnerability in this k6 testing framework, please report it privately first.

### 📧 **How to Report**

1. **Email**: Send details to the repository maintainer
2. **GitHub Security**: Use GitHub's private vulnerability reporting
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

### 🔒 **What We Protect**

- **API Keys**: Ensure no secrets in public code
- **Infrastructure**: Docker and monitoring setup
- **CI/CD**: GitHub Actions workflow security
- **Dependencies**: Keep npm packages updated

### ⏱️ **Response Time**

- **Initial response**: Within 48 hours
- **Status update**: Within 7 days
- **Resolution**: Varies by severity

### 🛡️ **Security Best Practices**

When using this framework:

1. **Never commit secrets**
   - Use environment variables
   - Add sensitive files to `.gitignore`
   - Use GitHub Secrets for CI/CD

2. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

3. **Secure your monitoring**
   - Change default Grafana passwords
   - Use strong passwords for InfluxDB
   - Restrict network access in production

4. **API Testing Security**
   - Don't test production APIs without permission
   - Use rate limiting responsibly
   - Respect API terms of service

### 🚨 **Known Considerations**

- **Public APIs**: Tests use public APIs which are generally safe
- **Docker Setup**: Default credentials should be changed for production
- **GitHub Actions**: Workflows have read-only permissions by default

### 📝 **Disclosure Policy**

1. **Private disclosure** first to maintainers
2. **Public disclosure** after fix is available
3. **Credit** given to security researchers (with permission)

Thank you for helping keep this project secure! 🔐
