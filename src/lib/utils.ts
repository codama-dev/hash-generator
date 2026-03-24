import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Retrieves an environment variable with a fallback value and optional warning logging
 * @param envVarName - The name of the environment variable (without VITE_ prefix)
 * @param defaultValue - The default value to use if the environment variable is not set
 * @param options - Optional configuration for logging behavior
 * @returns The environment variable value or the default value
 */
export function getViteEnvVar(
  envVarName: string,
  defaultValue: string,
  options: {
    logWarning?: boolean
    logPrefix?: string
  } = {}
): string {
  const { logWarning = true, logPrefix: _logPrefix = 'Environment' } = options
  const fullEnvVarName = `VITE_${envVarName}`
  const value = import.meta.env[fullEnvVarName as keyof ImportMetaEnv]

  if (value === undefined || value === '') {
    if (logWarning) {
    }
    return defaultValue
  }

  return value as string
}
