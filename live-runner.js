const { MongoMemoryServer } = require('mongodb-memory-server');
const localtunnel = require('localtunnel');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

async function start() {
    console.log('Starting In-Memory MongoDB...');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log('MongoDB Started at:', uri);

    // Create .env file
    const envContent = `MONGO_URI=${uri}\nPORT=5001\n`;
    fs.writeFileSync(path.join(__dirname, '.env'), envContent);
    console.log('.env file created.');

    console.log('Starting Server...');
    const server = spawn('node', ['src/server.js'], {
        stdio: 'inherit',
        env: { ...process.env, MONGO_URI: uri, PORT: '5001' }
    });

    server.on('error', (err) => {
        console.error('Failed to start server:', err);
    });

    // Wait a bit for server to start
    setTimeout(async () => {
        console.log('Opening LocalTunnel...');
        const tunnel = await localtunnel({ port: 5001 });

        console.log('====================================');
        console.log('YOUR LIVE LINK IS READY:');
        console.log(tunnel.url);
        console.log('====================================');

        tunnel.on('close', () => {
            console.log('Tunnel closed');
        });
    }, 5000);
}

start().catch(err => {
    console.error('Error starting live runner:', err);
});
