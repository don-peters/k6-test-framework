#!/bin/bash

# Clean up script for K6 Testing Framework
# Stops all services and cleans up temporary files

echo "🧹 Cleaning up K6 Testing Framework..."

# Stop Docker containers
echo "🛑 Stopping monitoring stack..."
docker-compose -f docker/docker-compose.yml down -v

# Remove Docker volumes (optional - uncomment if you want to reset all data)
# echo "🗑️  Removing Docker volumes..."
# docker volume rm k6-test-framework_influxdb_data k6-test-framework_grafana_data 2>/dev/null || true

# Clean npm artifacts
if [ -f "package.json" ]; then
    echo "🧽 Cleaning npm cache..."
    npm cache clean --force 2>/dev/null || true
fi

# Clean build artifacts
if [ -d "dist" ]; then
    echo "🗂️  Removing build artifacts..."
    rm -rf dist
fi

# Clean test results (optional - uncomment if you want to remove all results)
# echo "📊 Removing test results..."
# rm -rf results/*.json

echo "✨ Cleanup completed!"
