#!/usr/bin/env node

import { spawn } from 'child_process';
import net from 'net';
import fs from 'fs';
import path from 'path';

async function findAvailablePort(startPort) {
    let port = startPort;
    while (true) {
        try {
            await new Promise((resolve, reject) => {
                const server = net.createServer();
                server.listen(port, '127.0.0.1', () => {
                    server.close(resolve);
                });
                server.on('error', reject);
            });
            return port;
        } catch {
            console.log(`Port ${port} is in use, trying next...`);
            port++;
        }
    }
}

async function updateEnv(laravelPort) {
    const envPath = path.join(process.cwd(), '.env');
    let envContent = fs.readFileSync(envPath, 'utf-8');
    envContent = envContent.replace(/^APP_URL=.*/m, `APP_URL=http://127.0.0.1:${laravelPort}`);
    envContent = envContent.replace(/^VITE_APP_URL=.*/m, `VITE_APP_URL=http://127.0.0.1:${laravelPort}`);
    fs.writeFileSync(envPath, envContent);
}

async function main() {
    console.log('🔍 Finding available ports...');
    
    const laravelPort = await findAvailablePort(8000);
    const vitePort = await findAvailablePort(5173);
    
    console.log(`✅ Laravel will run on port ${laravelPort}`);
    console.log(`✅ Vite will run on port ${vitePort}`);
    
    await updateEnv(laravelPort);
    process.env.PORT = vitePort.toString();
    
    console.log('\n🚀 Starting servers...\n');
    
    // Start Laravel
    const laravel = spawn('php', ['artisan', 'serve', '--host=127.0.0.1', `--port=${laravelPort}`, '--no-reload'], {
        stdio: 'inherit',
        shell: true
    });
    
    // Give Laravel a moment
    await new Promise(r => setTimeout(r, 2000));
    
    // Start Vite
    const vite = spawn('npm', ['run', 'dev', '--', `--port=${vitePort}`, '--host=127.0.0.1'], {
        stdio: 'inherit',
        shell: true
    });
    
    console.log('\n=====================================');
    console.log('Servers running:');
    console.log(`  Laravel: http://127.0.0.1:${laravelPort}`);
    console.log(`  Vite:    http://127.0.0.1:${vitePort}`);
    console.log('=====================================\n');
    console.log('Press Ctrl+C to stop both servers\n');
    
    // Handle shutdown
    const shutdown = () => {
        console.log('\n🛑 Stopping servers...');
        laravel.kill();
        vite.kill();
        process.exit(0);
    };
    
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    
    // Wait for either process to exit
    await Promise.race([
        new Promise((resolve) => laravel.on('exit', resolve)),
        new Promise((resolve) => vite.on('exit', resolve))
    ]);
}

main().catch(console.error);