import { spawn } from "child_process"

export interface ExecResult {
  stdout: string
  stderr: string
  code: number
}

export async function exec(
  command: string,
  options: {
    cwd?: string
    timeout?: number
    silent?: boolean
  } = {}
): Promise<ExecResult> {
  const { cwd = process.cwd(), timeout = 300000, silent = false } = options

  return new Promise((resolve, reject) => {
    const isWindows = process.platform === "win32"

    const child = spawn(command, {
      cwd,
      shell: true,
      stdio: "pipe",
      env: {
        ...process.env,
        // Ensure npm/npx work correctly
        PATH: process.env.PATH,
      },
    })

    let stdout = ""
    let stderr = ""

    child.stdout?.on("data", (data) => {
      stdout += data.toString()
      if (!silent) {
        process.stdout.write(data)
      }
    })

    child.stderr?.on("data", (data) => {
      stderr += data.toString()
      if (!silent) {
        process.stderr.write(data)
      }
    })

    const timer = setTimeout(() => {
      child.kill()
      reject(new Error(`Command timed out after ${timeout}ms: ${command}`))
    }, timeout)

    child.on("error", (err) => {
      clearTimeout(timer)
      reject(err)
    })

    child.on("close", (code) => {
      clearTimeout(timer)
      resolve({
        stdout,
        stderr,
        code: code ?? 1,
      })
    })
  })
}

export async function execOrFail(
  command: string,
  options: {
    cwd?: string
    timeout?: number
    silent?: boolean
  } = {}
): Promise<ExecResult> {
  const result = await exec(command, options)

  if (result.code !== 0) {
    throw new Error(
      `Command failed with code ${result.code}: ${command}\n${result.stderr}`
    )
  }

  return result
}
