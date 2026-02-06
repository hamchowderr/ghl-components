import { spawn, ChildProcess } from "child_process"
import waitOn from "wait-on"

let serverProcess: ChildProcess | null = null

export async function startDevServer(port = 3000): Promise<ChildProcess> {
  console.log("🚀 Starting dev server...")

  return new Promise((resolve, reject) => {
    const isWindows = process.platform === "win32"
    const command = isWindows ? "npm.cmd" : "npm"

    serverProcess = spawn(command, ["run", "dev"], {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      shell: isWindows,
      env: { ...process.env, PORT: String(port) },
    })

    let started = false

    serverProcess.stdout?.on("data", (data) => {
      const output = data.toString()
      if (output.includes("Ready") || output.includes("started server")) {
        if (!started) {
          started = true
          resolve(serverProcess!)
        }
      }
    })

    serverProcess.stderr?.on("data", (data) => {
      // Next.js outputs some info to stderr, not always errors
      const output = data.toString()
      if (output.includes("error") && !output.includes("warning")) {
        console.error("Server error:", output)
      }
    })

    serverProcess.on("error", (err) => {
      reject(err)
    })

    serverProcess.on("exit", (code) => {
      if (!started && code !== 0) {
        reject(new Error(`Server exited with code ${code}`))
      }
    })

    // Timeout fallback - wait for server with wait-on
    setTimeout(async () => {
      if (!started) {
        try {
          await waitForServer(`http://localhost:${port}`)
          started = true
          resolve(serverProcess!)
        } catch {
          reject(new Error("Server failed to start within timeout"))
        }
      }
    }, 5000)
  })
}

export async function waitForServer(
  url: string,
  timeout = 60000
): Promise<void> {
  console.log(`⏳ Waiting for server at ${url}...`)

  await waitOn({
    resources: [url],
    timeout,
    interval: 1000,
    validateStatus: (status: number) => status === 200 || status === 404,
  })

  console.log(`✅ Server ready at ${url}`)
}

export function stopServer(): void {
  if (serverProcess) {
    console.log("🛑 Stopping dev server...")

    const isWindows = process.platform === "win32"

    if (isWindows && serverProcess.pid) {
      // On Windows, we need to kill the process tree using cmd.exe
      // to avoid Git Bash path conversion issues
      spawn("cmd", ["/c", `taskkill /PID ${serverProcess.pid} /F /T`], {
        shell: false,
        stdio: "ignore",
      })
    } else {
      serverProcess.kill("SIGTERM")
    }

    serverProcess = null
  }
}

export async function killPort(port: number): Promise<void> {
  const isWindows = process.platform === "win32"

  if (isWindows) {
    // Find and kill any process using the port
    const { exec: execCallback } = await import("child_process")
    const { promisify } = await import("util")
    const execPromise = promisify(execCallback)

    try {
      const { stdout } = await execPromise(`netstat -ano | findstr :${port}`)
      const lines = stdout.trim().split("\n")

      for (const line of lines) {
        const parts = line.trim().split(/\s+/)
        const pid = parts[parts.length - 1]
        if (pid && /^\d+$/.test(pid)) {
          try {
            await execPromise(`cmd /c "taskkill /PID ${pid} /F /T"`)
            console.log(`  Killed process ${pid} on port ${port}`)
          } catch {
            // Process may already be dead
          }
        }
      }
    } catch {
      // No process on port, that's fine
    }
  }
}

// Ensure cleanup on exit
process.on("exit", stopServer)
process.on("SIGINT", () => {
  stopServer()
  process.exit()
})
process.on("SIGTERM", () => {
  stopServer()
  process.exit()
})
