export { resolveBase }
export { resolveBaseFromUserConfig }

import { assert, assertUsage } from '../../utils'
import type { ResolvedConfig, UserConfig } from 'vite'
import type { ConfigVpsUserProvided } from './ConfigVps'
import { pickFirst } from './pickFirst'

type BaseServers = {
  baseServer: string
  baseAssets: string
}

function resolveBase(configs: ConfigVpsUserProvided[], config: ResolvedConfig): BaseServers {
  const baseServer = pickFirst(configs.map((c) => c.baseServer)) ?? null
  const baseAssets = pickFirst(configs.map((c) => c.baseAssets)) ?? null
  return resolve(config.base, baseServer, baseAssets)
}

function resolveBaseFromUserConfig(config: UserConfig, configVps: undefined | ConfigVpsUserProvided): BaseServers {
  return resolve(config.base ?? null, configVps?.baseServer ?? null, configVps?.baseAssets ?? null)
}

function resolve(base: string | null, baseServer_: string | null, baseAssets_: string | null): BaseServers {
  {
    const wrongBase = (val: string) => `should start with '/', 'http://', or 'https://' (it is ${val} instead)`
    assertUsage(base === null || isValidBase(base), `vite.config.js#base ${wrongBase(base!)}`)
    assertUsage(baseAssets_ === null || isValidBase(baseAssets_), `Config \`baseAssets\` ${wrongBase(baseAssets_!)}`)
    assertUsage(
      baseServer_ === null || baseServer_.startsWith('/'),
      `Config \`baseServer\` should start with a leading slash '/' (it is '${baseServer_}' instead)`
    )
  }
  if (base) {
    if (base.startsWith('http')) {
      baseAssets_ = baseAssets_ ?? base
    } else {
      baseAssets_ = baseAssets_ ?? base
      baseServer_ = baseServer_ ?? base
    }
  }
  const baseServer = baseServer_ ?? '/'
  const baseAssets = baseAssets_ ?? '/'
  assert(isValidBase(baseAssets))
  assert(baseServer.startsWith('/')) // TODO: use `isBaseServer()`
  return {
    baseServer,
    baseAssets
  }
}

function isValidBase(base: string): boolean { // TODO: move to `utils/parseUrl.ts`
  return base.startsWith('/') || base.startsWith('http://') || base.startsWith('https://')
}