import { spawn } from 'child_process';

const port = process.env.PORT || 4173;
const host = '0.0.0.0';

console.log(`Starting Vite preview server on ${host}:${port}`);

const child = spawn('npx', ['vite', 'preview', '--host', host, '--port', port], {
    stdio: 'inherit'
});

child.on('error', (error) => {
    console.error('Error starting server:', error);
    process.exit(1);
});

child.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
    process.exit(code);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully...');
    child.kill('SIGINT');
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    child.kill('SIGTERM');
});
