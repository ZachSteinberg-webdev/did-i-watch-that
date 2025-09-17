// dev.js — minimal dev runner (no external deps)
// The command to execute the script is "npm run dev"
// The script should be executed from the root of the project/repo
// An optional port number for the Vite frontend can be passed with -- --PORT NUMBER
// EX: npm run dev -- --5174
const { spawn } = require('child_process');

function run(name, cwd, npmArgs) {
	const child = spawn('npm', npmArgs, {
		cwd,
		stdio: ['ignore', 'pipe', 'pipe'],
		shell: true,
		env: process.env
	});
	const prefix = `[${name}]`;
	child.stdout.on('data', (d) => process.stdout.write(`${prefix} ${d}`));
	child.stderr.on('data', (d) => process.stderr.write(`${prefix} ${d}`));
	child.on('exit', (code, signal) => {
		console.log(`${prefix} exited (${signal || code})`);
		// If one exits, stop the whole dev session
		process.exit(code || 0);
	});
	return child;
}

const backend = run('backend', 'backend', ['start']);
const frontend = run('frontend', 'frontend', ['run', 'dev']);

function shutdown() {
	backend && backend.kill('SIGINT');
	frontend && frontend.kill('SIGINT');
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
