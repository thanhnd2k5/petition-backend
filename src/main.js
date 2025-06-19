import sourceMapSupport from 'source-map-support'
import {spawn} from 'child_process'
import {db} from './configs'
import createApp from '.'
import executeScheduledTasks from './tasks'
import {getInterfaceIp} from './utils/helpers'
import {createServer} from 'http'
import {Server} from 'socket.io'

// enable source maps
sourceMapSupport.install()

const host = process.env.HOST || 'localhost'
const port = parseInt(process.env.PORT, 10) || 3456

const app = createApp()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: process.env.APP_URL_CLIENT || 'http://localhost:3456',
        methods: ['GET', 'POST']
    }
})

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Join print job room
    socket.on('join_print_job', (printJobId) => {
        socket.join(`print_job_${printJobId}`)
        console.log(`Client ${socket.id} joined print job room: ${printJobId}`)
    })

    // Leave print job room
    socket.on('leave_print_job', (printJobId) => {
        socket.leave(`print_job_${printJobId}`)
        console.log(`Client ${socket.id} left print job room: ${printJobId}`)
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
    })
})

// Make io accessible to other modules
app.set('io', io)

db.connect().then(() => console.log('Database connection successful!'))

// Run Server
httpServer.listen(port, host, async function () {
    let displayHostname = host
    if (['0.0.0.0', '::'].includes(host)) {
        if (host === '0.0.0.0') {
            displayHostname = await getInterfaceIp('IPv4')
        } else {
            displayHostname = await getInterfaceIp('IPv6')
        }
    }
    if (host.includes(':')) {
        displayHostname = `[${displayHostname}]`
    }
    console.log(`Server is running on http://${displayHostname}:${port} in ${app.settings.env} mode.`)
})

// scheduled tasks
executeScheduledTasks()

// Eslint
if (process.env.__ESLINT__ === 'true') {
    const command = 'npm run lint:fix --silent'
    const eslintProcess = spawn(command, {
        stdio: 'inherit',
        shell: true
    })

    eslintProcess.on('close', (code) => {
        if (code !== 0) process.exit(1)
    })
}
