#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function analyzeResults() {
    const resultsDir = path.join(__dirname, '..', 'results');
    
    if (!fs.existsSync(resultsDir)) {
        console.log('❌ No results directory found. Run some tests first!');
        return;
    }

    const files = fs.readdirSync(resultsDir).filter(f => f.endsWith('.json'));
    
    if (files.length === 0) {
        console.log('❌ No JSON result files found. Run tests with JSON output:');
        console.log('   k6 run --out json=results/test-results.json tests/smoke/api-smoke-test.js');
        return;
    }

    console.log('📊 K6 Test Results Analysis\n');
    console.log('=' .repeat(50));

    files.forEach(file => {
        console.log(`\n📄 File: ${file}`);
        console.log('-'.repeat(30));
        
        try {
            const filePath = path.join(resultsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.trim().split('\n');
            
            const metrics = {};
            let testType = 'unknown';
            
            lines.forEach(line => {
                try {
                    const data = JSON.parse(line);
                    if (data.type === 'Point') {
                        const metricName = data.metric;
                        const value = data.data.value;
                        const tags = data.data.tags || {};
                        
                        if (tags.testType) testType = tags.testType;
                        
                        if (!metrics[metricName]) {
                            metrics[metricName] = [];
                        }
                        metrics[metricName].push(value);
                    }
                } catch (e) {
                    // Skip invalid JSON lines
                }
            });

            console.log(`📈 Test Type: ${testType}`);
            console.log(`📦 Total Lines: ${lines.length}`);
            
            if (metrics.http_reqs) {
                console.log(`🌐 Total Requests: ${metrics.http_reqs.reduce((a, b) => a + b, 0)}`);
            }
            
            if (metrics.http_req_duration) {
                const durations = metrics.http_req_duration;
                const avg = (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2);
                const max = Math.max(...durations).toFixed(2);
                const min = Math.min(...durations).toFixed(2);
                console.log(`⏱️  Response Times (ms):`);
                console.log(`   • Average: ${avg}ms`);
                console.log(`   • Min: ${min}ms`);
                console.log(`   • Max: ${max}ms`);
            }
            
            if (metrics.http_req_failed) {
                const failures = metrics.http_req_failed.reduce((a, b) => a + b, 0);
                const total = metrics.http_reqs ? metrics.http_reqs.length : 0;
                const failureRate = total > 0 ? ((failures / total) * 100).toFixed(2) : 0;
                console.log(`❌ Failure Rate: ${failureRate}%`);
            }
            
            if (metrics.checks) {
                const totalChecks = metrics.checks.length;
                const passedChecks = metrics.checks.reduce((a, b) => a + b, 0);
                const passRate = totalChecks > 0 ? ((passedChecks / totalChecks) * 100).toFixed(2) : 0;
                console.log(`✅ Check Pass Rate: ${passRate}% (${passedChecks}/${totalChecks})`);
            }
            
        } catch (error) {
            console.log(`❌ Error analyzing ${file}: ${error.message}`);
        }
    });

    console.log('\n' + '='.repeat(50));
    console.log('💡 Tips:');
    console.log('• View detailed metrics in Grafana by running: npm run monitor:up');
    console.log('• Generate HTML reports with k6-reporter or similar tools');
    console.log('• Use k6 Cloud for advanced analytics');
}

if (require.main === module) {
    analyzeResults();
}

module.exports = { analyzeResults };
