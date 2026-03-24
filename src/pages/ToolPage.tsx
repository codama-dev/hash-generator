import { Check, Copy, Upload, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ShareModal, isShareDismissed } from '@/components/ShareModal'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/pages/PageHeader'

// ---- MD5 Implementation (RFC 1321) ----

function md5(input: string): string {
  const bytes = new TextEncoder().encode(input)
  return md5FromBytes(bytes)
}

function md5FromBytes(bytes: Uint8Array): string {
  function rotl(x: number, n: number) {
    return (x << n) | (x >>> (32 - n))
  }
  function toUint32(x: number) {
    return x >>> 0
  }

  const K = new Uint32Array(64)
  for (let i = 0; i < 64; i++) {
    K[i] = toUint32(Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000))
  }
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ]

  const origLen = bytes.length
  const bitLen = origLen * 8
  const padLen = origLen % 64 < 56 ? 56 - (origLen % 64) : 120 - (origLen % 64)
  const padded = new Uint8Array(origLen + padLen + 8)
  padded.set(bytes)
  padded[origLen] = 0x80
  const dv = new DataView(padded.buffer)
  dv.setUint32(padded.length - 8, bitLen >>> 0, true)
  dv.setUint32(padded.length - 4, Math.floor(bitLen / 0x100000000) >>> 0, true)

  let a0 = 0x67452301
  let b0 = 0xefcdab89
  let c0 = 0x98badcfe
  let d0 = 0x10325476

  for (let offset = 0; offset < padded.length; offset += 64) {
    const M = new Uint32Array(16)
    for (let j = 0; j < 16; j++) {
      M[j] = dv.getUint32(offset + j * 4, true)
    }
    let A = a0, B = b0, C = c0, D = d0
    for (let i = 0; i < 64; i++) {
      let F: number, g: number
      if (i < 16) {
        F = (B & C) | (~B & D); g = i
      } else if (i < 32) {
        F = (D & B) | (~D & C); g = (5 * i + 1) % 16
      } else if (i < 48) {
        F = B ^ C ^ D; g = (3 * i + 5) % 16
      } else {
        F = C ^ (B | ~D); g = (7 * i) % 16
      }
      F = toUint32(F + A + K[i] + M[g])
      A = D; D = C; C = B; B = toUint32(B + rotl(F, S[i]))
    }
    a0 = toUint32(a0 + A)
    b0 = toUint32(b0 + B)
    c0 = toUint32(c0 + C)
    d0 = toUint32(d0 + D)
  }

  function toHexLE(v: number) {
    const bytes = [(v & 0xff), ((v >>> 8) & 0xff), ((v >>> 16) & 0xff), ((v >>> 24) & 0xff)]
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('')
  }
  return toHexLE(a0) + toHexLE(b0) + toHexLE(c0) + toHexLE(d0)
}

// ---- SHA via Web Crypto ----

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

async function sha(algorithm: string, data: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest(algorithm, data)
  return bufToHex(hash)
}

// ---- Hash all algorithms ----

interface HashResults {
  md5: string
  sha1: string
  sha256: string
  sha512: string
}

async function hashText(text: string): Promise<HashResults> {
  const encoded = new TextEncoder().encode(text)
  const buffer = encoded.buffer as ArrayBuffer
  const [sha1, sha256, sha512] = await Promise.all([
    sha('SHA-1', buffer),
    sha('SHA-256', buffer),
    sha('SHA-512', buffer),
  ])
  return { md5: md5(text), sha1, sha256, sha512 }
}

async function hashFile(buffer: ArrayBuffer): Promise<HashResults> {
  const bytes = new Uint8Array(buffer)
  const [sha1, sha256, sha512] = await Promise.all([
    sha('SHA-1', buffer),
    sha('SHA-256', buffer),
    sha('SHA-512', buffer),
  ])
  return { md5: md5FromBytes(bytes), sha1, sha256, sha512 }
}

// ---- Component ----

type Tab = 'text' | 'file'
type Algo = 'md5' | 'sha1' | 'sha256' | 'sha512'

const ALGOS: Algo[] = ['md5', 'sha1', 'sha256', 'sha512']

export function ToolPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('text')
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<HashResults | null>(null)
  const [uppercase, setUppercase] = useState(false)
  const [copiedAlgo, setCopiedAlgo] = useState<Algo | null>(null)
  const [hashing, setHashing] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Compare
  const [hash1, setHash1] = useState('')
  const [hash2, setHash2] = useState('')
  const [compareResult, setCompareResult] = useState<boolean | null>(null)

  // Share modal
  const [shareOpen, setShareOpen] = useState(false)
  const hasTriggeredShare = useRef(false)

  const triggerShare = useCallback(() => {
    if (!hasTriggeredShare.current && !isShareDismissed()) {
      hasTriggeredShare.current = true
      setShareOpen(true)
    }
  }, [])

  const handleTextChange = useCallback(
    async (text: string) => {
      setInput(text)
      if (!text) {
        setHashes(null)
        return
      }
      setHashing(true)
      const result = await hashText(text)
      setHashes(result)
      setHashing(false)
      triggerShare()
    },
    [triggerShare]
  )

  const processFile = useCallback(
    async (file: File) => {
      setFileName(file.name)
      setHashing(true)
      const buffer = await file.arrayBuffer()
      const result = await hashFile(buffer)
      setHashes(result)
      setHashing(false)
      triggerShare()
    },
    [triggerShare]
  )

  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const copyHash = useCallback(
    async (algo: Algo) => {
      if (!hashes) return
      const value = uppercase ? hashes[algo].toUpperCase() : hashes[algo]
      try {
        await navigator.clipboard.writeText(value)
        setCopiedAlgo(algo)
        toast.success(t('tool.copiedToClipboard'))
        setTimeout(() => setCopiedAlgo(null), 2000)
      } catch {
        toast.error(t('tool.copyFailed'))
      }
    },
    [hashes, uppercase, t]
  )

  const handleCompare = useCallback(() => {
    if (!hash1.trim() || !hash2.trim()) {
      setCompareResult(null)
      return
    }
    setCompareResult(hash1.trim().toLowerCase() === hash2.trim().toLowerCase())
  }, [hash1, hash2])

  const formatHash = (value: string) => (uppercase ? value.toUpperCase() : value)

  return (
    <div className="space-y-8">
      <PageHeader />

      <div className="mx-auto max-w-4xl space-y-6 px-4">
        {/* Tab toggle */}
        <div className="flex justify-center gap-2">
          <Button
            variant={tab === 'text' ? 'default' : 'outline'}
            onClick={() => {
              setTab('text')
              setHashes(null)
              setFileName(null)
            }}
          >
            {t('tool.textTab')}
          </Button>
          <Button
            variant={tab === 'file' ? 'default' : 'outline'}
            onClick={() => {
              setTab('file')
              setHashes(null)
              setInput('')
            }}
          >
            {t('tool.fileTab')}
          </Button>
        </div>

        {/* Input area */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          {tab === 'text' ? (
            <textarea
              className="min-h-[120px] w-full resize-y rounded-lg border bg-background p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={t('tool.placeholder')}
              value={input}
              onChange={e => handleTextChange(e.target.value)}
              dir="ltr"
            />
          ) : (
            <div
              className={`flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                dragOver ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onDragOver={e => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
              }}
              role="button"
              tabIndex={0}
            >
              <Upload className="mb-2 size-8 text-muted-foreground" />
              <p className="text-center text-muted-foreground text-sm">
                {fileName || t('tool.dropFile')}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          )}
        </div>

        {/* Uppercase toggle */}
        <div className="flex justify-end">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={e => setUppercase(e.target.checked)}
              className="size-4 rounded border-border"
            />
            {t('tool.uppercase')}
          </label>
        </div>

        {/* Hash results */}
        {hashing && (
          <div className="text-center text-muted-foreground text-sm">{t('tool.hashing')}</div>
        )}
        {hashes && (
          <div className="space-y-3">
            {ALGOS.map(algo => (
              <div
                key={algo}
                className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm"
              >
                <span className="w-16 shrink-0 font-semibold text-muted-foreground text-xs uppercase">
                  {t(`tool.${algo}`)}
                </span>
                <code
                  className="min-w-0 flex-1 overflow-hidden text-ellipsis break-all font-mono text-sm"
                  dir="ltr"
                >
                  {formatHash(hashes[algo])}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0"
                  onClick={() => copyHash(algo)}
                >
                  {copiedAlgo === algo ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  <span className="sr-only">
                    {copiedAlgo === algo ? t('tool.copied') : t('tool.copy')}
                  </span>
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Hash comparison */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-lg">{t('tool.compareHashes')}</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-muted-foreground text-sm" htmlFor="hash1">
                {t('tool.hash1')}
              </label>
              <input
                id="hash1"
                type="text"
                className="w-full rounded-lg border bg-background p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={hash1}
                onChange={e => {
                  setHash1(e.target.value)
                  setCompareResult(null)
                }}
                dir="ltr"
              />
            </div>
            <div>
              <label className="mb-1 block text-muted-foreground text-sm" htmlFor="hash2">
                {t('tool.hash2')}
              </label>
              <input
                id="hash2"
                type="text"
                className="w-full rounded-lg border bg-background p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={hash2}
                onChange={e => {
                  setHash2(e.target.value)
                  setCompareResult(null)
                }}
                dir="ltr"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={handleCompare}>{t('tool.compare')}</Button>
              {compareResult !== null && (
                <span
                  className={`flex items-center gap-1 font-semibold text-sm ${
                    compareResult ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {compareResult ? (
                    <>
                      <Check className="size-5" />
                      {t('tool.match')}
                    </>
                  ) : (
                    <>
                      <X className="size-5" />
                      {t('tool.noMatch')}
                    </>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <ShareModal open={shareOpen} onOpenChange={setShareOpen} showDismissOption />
    </div>
  )
}
