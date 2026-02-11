#!/usr/bin/env node
/**
 * Vaultbrix Status Checker
 * Checks all endpoints and updates status files
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const yaml = require('yaml');

const CONFIG_FILE = path.join(__dirname, '..', 'upptime.yml');
const HISTORY_DIR = path.join(__dirname, '..', 'history');
const API_DIR = path.join(__dirname, '..', 'api');
const INCIDENTS_FILE = path.join(HISTORY_DIR, 'incidents.json');

// Ensure directories exist
[HISTORY_DIR, API_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Load configuration
const config = yaml.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));

/**
 * Load current incidents
 */
function loadIncidents() {
  if (fs.existsSync(INCIDENTS_FILE)) {
    return JSON.parse(fs.readFileSync(INCIDENTS_FILE, 'utf8'));
  }
  return [];
}

/**
 * Save incidents
 */
function saveIncidents(incidents) {
  fs.writeFileSync(INCIDENTS_FILE, JSON.stringify(incidents, null, 2));
}

/**
 * Get the previous status for a service
 */
function getPreviousStatus(siteName) {
  const slug = siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const historyFile = path.join(HISTORY_DIR, `${slug}.json`);

  if (fs.existsSync(historyFile)) {
    const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
    if (history.length > 0) {
      return history[history.length - 1].status;
    }
  }
  return 'up'; // Assume up if no history
}

/**
 * Handle incident creation/updates
 */
function handleIncident(siteName, currentStatus, previousStatus, responseTime) {
  const incidents = loadIncidents();
  const now = new Date().toISOString();

  // Find active incident for this service
  const activeIncidentIndex = incidents.findIndex(
    inc => inc.service === siteName && inc.status !== 'resolved'
  );

  if (currentStatus === 'down' && previousStatus === 'up') {
    // Service just went down - create new incident
    const newIncident = {
      id: `inc-${Date.now()}`,
      title: `${siteName} is experiencing issues`,
      service: siteName,
      status: 'investigating',
      severity: 'major',
      createdAt: now,
      updates: [
        {
          timestamp: now,
          status: 'investigating',
          message: `${siteName} is not responding as expected. Our team is investigating.`
        }
      ]
    };
    incidents.unshift(newIncident); // Add to beginning
    console.log(`🚨 Created incident for ${siteName}`);

  } else if (currentStatus === 'down' && activeIncidentIndex !== -1) {
    // Service still down - update incident
    const incident = incidents[activeIncidentIndex];
    const lastUpdate = incident.updates[incident.updates.length - 1];

    // Only add update if status changed or every 30 minutes
    const lastUpdateTime = new Date(lastUpdate.timestamp).getTime();
    const timeSinceLastUpdate = Date.now() - lastUpdateTime;

    if (timeSinceLastUpdate > 30 * 60 * 1000) { // 30 minutes
      incident.updates.push({
        timestamp: now,
        status: 'monitoring',
        message: `Still monitoring. Response time: ${responseTime}ms`
      });
      incident.status = 'monitoring';
    }

  } else if (currentStatus === 'up' && activeIncidentIndex !== -1) {
    // Service recovered - resolve incident
    const incident = incidents[activeIncidentIndex];
    incident.status = 'resolved';
    incident.resolvedAt = now;
    incident.updates.push({
      timestamp: now,
      status: 'resolved',
      message: `${siteName} is back online and operating normally.`
    });
    console.log(`✅ Resolved incident for ${siteName}`);
  }

  // Keep only last 50 incidents
  const trimmedIncidents = incidents.slice(0, 50);
  saveIncidents(trimmedIncidents);
}

/**
 * Check a single endpoint
 */
async function checkEndpoint(site) {
  const startTime = Date.now();

  return new Promise((resolve) => {
    const url = new URL(site.url);
    const client = url.protocol === 'https:' ? https : http;

    const req = client.get(site.url, { timeout: 10000 }, (res) => {
      const responseTime = Date.now() - startTime;
      const expectedCodes = site.expectedStatusCodes || [200, 201, 204, 301, 302];
      const isUp = expectedCodes.includes(res.statusCode);

      resolve({
        name: site.name,
        url: site.url,
        status: isUp ? 'up' : 'down',
        code: res.statusCode,
        responseTime,
        timestamp: new Date().toISOString()
      });
    });

    req.on('error', () => {
      resolve({
        name: site.name,
        url: site.url,
        status: 'down',
        code: 0,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: site.name,
        url: site.url,
        status: 'down',
        code: 0,
        responseTime: 10000,
        timestamp: new Date().toISOString()
      });
    });
  });
}

/**
 * Update history file for a site
 */
function updateHistory(siteName, result) {
  const slug = siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const historyFile = path.join(HISTORY_DIR, `${slug}.json`);

  let history = [];
  if (fs.existsSync(historyFile)) {
    history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
  }

  // Add new entry
  history.push({
    timestamp: result.timestamp,
    status: result.status,
    code: result.code,
    responseTime: result.responseTime
  });

  // Keep last 90 days (12 checks/hour * 24 hours * 90 days = 25920)
  const maxEntries = 25920;
  if (history.length > maxEntries) {
    history = history.slice(-maxEntries);
  }

  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));

  return history;
}

/**
 * Calculate uptime percentage
 */
function calculateUptime(history) {
  if (history.length === 0) return 100;
  const upCount = history.filter(h => h.status === 'up').length;
  return Number(((upCount / history.length) * 100).toFixed(2));
}

/**
 * Calculate average response time
 */
function calculateAvgResponseTime(history) {
  if (history.length === 0) return 0;
  const total = history.reduce((sum, h) => sum + h.responseTime, 0);
  return Math.round(total / history.length);
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Checking Vaultbrix services...\n');

  const results = [];
  const summary = {
    lastUpdated: new Date().toISOString(),
    overall: 'up',
    services: []
  };

  for (const site of config.sites) {
    const previousStatus = getPreviousStatus(site.name);
    const result = await checkEndpoint(site);
    results.push(result);

    const history = updateHistory(site.name, result);
    const uptime = calculateUptime(history);
    const avgResponseTime = calculateAvgResponseTime(history);

    // Handle automatic incident creation/resolution
    handleIncident(site.name, result.status, previousStatus, result.responseTime);

    const statusIcon = result.status === 'up' ? '✅' : '❌';
    console.log(`${statusIcon} ${site.name}: ${result.status} (${result.responseTime}ms)`);

    summary.services.push({
      name: site.name,
      url: site.url,
      status: result.status,
      code: result.code,
      responseTime: result.responseTime,
      uptime,
      avgResponseTime
    });

    if (result.status !== 'up') {
      summary.overall = 'degraded';
    }
  }

  // Check if all down
  if (summary.services.every(s => s.status !== 'up')) {
    summary.overall = 'down';
  }

  // Write summary API file
  fs.writeFileSync(
    path.join(API_DIR, 'status.json'),
    JSON.stringify(summary, null, 2)
  );

  // Generate combined history.json for the frontend
  const combinedHistory = {
    'api': [],
    'dashboard': [],
    'website': [],
    'auth-service': [],
    'incidents': []  // Real incidents only - add manually when they occur
  };

  // Read each service's history file
  for (const site of config.sites) {
    const slug = site.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const historyFile = path.join(HISTORY_DIR, `${slug}.json`);

    if (fs.existsSync(historyFile)) {
      const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
      // Get last 24 hours of data for charts (288 entries at 5-min intervals)
      combinedHistory[slug] = history.slice(-288);
    }
  }

  // Check if incidents.json exists and merge it
  const incidentsFile = path.join(HISTORY_DIR, 'incidents.json');
  if (fs.existsSync(incidentsFile)) {
    combinedHistory.incidents = JSON.parse(fs.readFileSync(incidentsFile, 'utf8'));
  }

  fs.writeFileSync(
    path.join(HISTORY_DIR, 'history.json'),
    JSON.stringify(combinedHistory, null, 2)
  );

  console.log(`\n📊 Overall status: ${summary.overall}`);
  console.log(`📁 Updated ${API_DIR}/status.json`);
  console.log(`📁 Updated ${HISTORY_DIR}/history.json`);
}

main().catch(console.error);
