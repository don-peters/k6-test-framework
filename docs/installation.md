# K6 Installation Guide

## Prerequisites

### 1. Install k6

#### macOS
```bash
brew install k6
```

#### Linux (Ubuntu/Debian)
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

#### Windows
```powershell
# Using Chocolatey
choco install k6

# Using Winget
winget install k6
```

#### Manual Installation
Download from [k6.io](https://k6.io/docs/get-started/installation/) and follow platform-specific instructions.

### 2. Install Docker
Required for the monitoring stack (Grafana + InfluxDB):
- Download from [docker.com](https://docs.docker.com/get-docker/)
- Verify installation: `docker --version`

### 3. Install Node.js
Required for TypeScript support and npm scripts:
- Download from [nodejs.org](https://nodejs.org/)
- Verify installation: `node --version && npm --version`

## Quick Setup

After installing prerequisites:

```bash
# 1. Install npm dependencies
npm install

# 2. Make scripts executable (Linux/macOS)
chmod +x scripts/*.sh

# 3. Run setup script (optional)
./scripts/setup.sh

# 4. Or manually start monitoring
npm run monitoring:up

# 5. Run your first test
npm run test:sample
```

## Verify Installation

Run the verification script:

```bash
# Check all prerequisites
k6 version
docker --version
node --version
npm --version

# Test k6 with a simple script
k6 run --vus 1 --duration 10s tests/samples/basic-test.js
```

## Troubleshooting

### k6 command not found
- Ensure k6 is installed and in your PATH
- On macOS: `which k6` should show `/usr/local/bin/k6` or similar
- On Linux: Try `sudo apt-get install k6` or check your package manager

### Docker issues
- Ensure Docker Desktop is running
- Check permissions: `docker run hello-world`
- For Linux: add user to docker group: `sudo usermod -aG docker $USER`

### Port conflicts
If ports 3000 or 8086 are in use:
- Stop conflicting services
- Or modify `docker/docker-compose.yml` to use different ports

### Permission issues
On Linux/macOS, make scripts executable:
```bash
chmod +x scripts/*.sh
```
