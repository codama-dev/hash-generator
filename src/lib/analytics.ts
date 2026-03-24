/**
 * Google Analytics and Search Console configuration.
 *
 * UPDATE THESE for each tool:
 * - GA_MEASUREMENT_ID: your GA4 measurement ID (e.g. "G-XXXXXXXXXX")
 * - GOOGLE_SITE_VERIFICATION: Google Search Console verification string
 *
 * Leave empty to keep analytics disabled.
 */
export const GA_MEASUREMENT_ID = 'G-HTL7S4QPFC'
export const GOOGLE_SITE_VERIFICATION = ''

const GA_SCRIPT_URL = 'https://www.googletagmanager.com/gtag/js'

function loadGoogleAnalytics(measurementId: string): void {
  if (typeof window === 'undefined' || !measurementId) {
    return
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `${GA_SCRIPT_URL}?id=${measurementId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: true })
}

function addSearchConsoleVerification(content: string): void {
  if (typeof document === 'undefined' || !content) {
    return
  }

  let meta = document.querySelector('meta[name="google-site-verification"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'google-site-verification')
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function initAnalytics(): void {
  if (GA_MEASUREMENT_ID) {
    loadGoogleAnalytics(GA_MEASUREMENT_ID)
  }
  if (GOOGLE_SITE_VERIFICATION) {
    addSearchConsoleVerification(GOOGLE_SITE_VERIFICATION)
  }
}

export function initAnalyticsWhenReady(): void {
  if (typeof window === 'undefined') {
    return
  }
  if (document.readyState === 'complete') {
    initAnalytics()
    return
  }
  window.addEventListener('load', () => initAnalytics(), { once: true })
}
