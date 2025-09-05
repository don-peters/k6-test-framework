<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# K6 Testing Framework - Copilot Instructions

This is a comprehensive k6 performance testing framework with TypeScript support, Grafana dashboards, and CI/CD integration.

## Project Structure
- `/tests/` - K6 test scripts organized by API/service
- `/config/` - Environment configurations and test parameters  
- `/dashboards/` - Grafana dashboard JSON files
- `/scripts/` - Utility scripts for setup and execution
- `/docs/` - Documentation and best practices
- `/.github/workflows/` - GitHub Actions CI/CD pipelines

## Development Guidelines
- Write tests in TypeScript with proper type definitions
- Follow k6 best practices for performance testing
- Include proper error handling and assertions
- Use environment-specific configurations
- Document all test scenarios and expected outcomes
- Implement proper tagging for test categorization

## Progress Tracking
- [x] Clarify Project Requirements - K6 testing framework with Grafana dashboards
- [x] Scaffold the Project - Create comprehensive folder structure
- [x] Customize the Project - Add k6 tests, configs, and dashboards
- [x] Install Required Extensions - TypeScript and development tools installed
- [x] Compile the Project - Set up TypeScript compilation and dependencies
- [x] Create and Run Task - Set up test execution tasks
- [x] Launch the Project - Provide execution instructions
- [x] Ensure Documentation is Complete - Complete README and docs

## Installation Required
To use this framework, install k6 first:
- macOS: `brew install k6`
- Linux: See k6.io installation guide
- Windows: `choco install k6` or download from k6.io
