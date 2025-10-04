#!/usr/bin/env node

// Simple startup script to ensure proper initialization
console.log('Starting Book Review Backend...');
console.log('Node.js version:', process.version);
console.log('Environment:', process.env.NODE_ENV || 'development');

// Import and start the server
require('./server.js');
