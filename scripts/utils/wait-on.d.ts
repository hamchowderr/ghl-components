declare module 'wait-on' {
  interface WaitOnOptions {
    resources: string[]
    timeout?: number
    interval?: number
    delay?: number
    window?: number
    reverse?: boolean
    simultaneous?: number
    tcpTimeout?: number
    httpTimeout?: number
    strictSSL?: boolean
    followRedirect?: boolean
    headers?: Record<string, string>
    auth?: { user: string; pass: string }
    validateStatus?: (status: number) => boolean
  }

  function waitOn(options: WaitOnOptions): Promise<void>
  export = waitOn
}
