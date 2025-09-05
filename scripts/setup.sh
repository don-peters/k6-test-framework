#!/bin/bash

# K6 Test Framework Setup Script
# This script sets up the complete testing environment

set -e

echo "🚀 Setting up K6 Testing Framework..."

# Check if k6 is installed
if ! command -v k6 &> /dev/null; then
    echo "❌ k6 is not installed. Please install k6 first:"
    echo "   https://k6.io/docs/getting-started/installation/"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   https://nodejs.org/"
    exit 1
fi

echo "✅ All prerequisites are installed"

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# Create results directory
echo "📁 Creating results directory..."
mkdir -p results

# Build TypeScript files (if any)
if [ -f "tsconfig.json" ]; then
    echo "🔨 Building TypeScript files..."
    npm run build 2>/dev/null || echo "ℹ️  No TypeScript build needed"
fi

# Start monitoring stack
echo "🐳 Starting monitoring stack..."
docker-compose -f docker/docker-compose.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if InfluxDB is ready
until curl -s http://localhost:8086/ping > /dev/null; do
    echo "⏳ Waiting for InfluxDB..."
    sleep 5
done

# Check if Grafana is ready
until curl -s http://localhost:3000/api/health > /dev/null; do
    echo "⏳ Waiting for Grafana..."
    sleep 5
done

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📊 Access Grafana at: http://localhost:3000"
echo "   Username: admin"
echo "   Password: admin"
echo ""
echo "🗄️  InfluxDB available at: http://localhost:8086"
echo ""
echo "🧪 Run your first test:"
echo "   npm run test:sample"
echo ""
echo "📈 Run load test with monitoring:"
echo "   npm run test:load"
echo ""
echo "🛑 Stop monitoring stack:"
echo "   npm run monitoring:down"
