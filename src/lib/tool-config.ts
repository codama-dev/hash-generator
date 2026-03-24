/**
 * TOOL CONFIGURATION
 *
 * Update these values for each new tool.
 * This is the single source of truth for tool-specific settings.
 */

export const TOOL_CONFIG = {
  /** Display name of the tool (e.g. "JSON Formatter") */
  name: 'Hash Generator',

  /** Short tagline (e.g. "Format and validate JSON instantly") */
  tagline: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly',

  /** Full URL of the deployed tool */
  url: 'https://free-hash-generator.codama.dev/',

  /** localStorage key prefix to avoid collisions between tools */
  storagePrefix: 'codama-hash-generator',
} as const
