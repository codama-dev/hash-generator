import { Check, Copy, Facebook, Linkedin, Mail, Twitter } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { TOOL_CONFIG } from '@/lib/tool-config'

const DISMISS_KEY = `${TOOL_CONFIG.storagePrefix}-shareModalDismissed`

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

interface ShareTarget {
  key: string
  labelKey: string
  icon: React.ReactNode
  getUrl: (shareText: string, siteUrl: string) => string
  bgClass: string
}

const SHARE_TARGETS: ShareTarget[] = [
  {
    key: 'whatsapp',
    labelKey: 'share.whatsapp',
    icon: <WhatsAppIcon className="size-5" />,
    getUrl: text => `https://wa.me/?text=${encodeURIComponent(text)}`,
    bgClass: 'bg-[#25D366] hover:bg-[#1ebe5b]',
  },
  {
    key: 'facebook',
    labelKey: 'share.facebook',
    icon: <Facebook className="size-5" aria-hidden="true" />,
    getUrl: (_, url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    bgClass: 'bg-[#1877F2] hover:bg-[#1469d8]',
  },
  {
    key: 'x',
    labelKey: 'share.x',
    icon: <Twitter className="size-5" aria-hidden="true" />,
    getUrl: (text, url) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    bgClass: 'bg-[#000000] hover:bg-[#222222]',
  },
  {
    key: 'linkedin',
    labelKey: 'share.linkedin',
    icon: <Linkedin className="size-5" aria-hidden="true" />,
    getUrl: (_, url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    bgClass: 'bg-[#0A66C2] hover:bg-[#0856a4]',
  },
  {
    key: 'email',
    labelKey: 'share.email',
    icon: <Mail className="size-5" aria-hidden="true" />,
    getUrl: (text, url) =>
      `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
    bgClass: 'bg-orange-500 hover:bg-orange-600',
  },
]

export function isShareDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === 'true'
  } catch {
    return false
  }
}

interface ShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  showDismissOption?: boolean
}

export function ShareModal({ open, onOpenChange, showDismissOption = false }: ShareModalProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const shareText = t('share.message')

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(TOOL_CONFIG.url)
      setCopied(true)
      toast.success(t('share.linkCopied'))
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error(t('share.copyFailed'))
    }
  }, [t])

  const handleDismiss = useCallback(
    (checked: boolean) => {
      if (checked) {
        try {
          localStorage.setItem(DISMISS_KEY, 'true')
        } catch {
          // localStorage not available
        }
        onOpenChange(false)
      }
    },
    [onOpenChange]
  )

  useEffect(() => {
    if (!open) {
      setCopied(false)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-lg">
        {/* Orange gradient hero banner */}
        <div className="relative bg-linear-to-br from-orange-500 via-amber-400 to-orange-500 px-6 pt-10 pb-6 text-center text-white">
          {/* Decorative glow */}
          <div
            className="absolute top-0 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl"
            aria-hidden="true"
          />

          <DialogHeader className="relative items-center gap-3">
            <DialogTitle className="font-extrabold text-2xl text-white tracking-tight sm:text-3xl">
              {t('share.title')}
            </DialogTitle>
            <DialogDescription className="text-base text-white/90">
              {t('share.description')}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Share buttons */}
        <div className="px-6 pt-4 pb-2">
          <p className="mb-3 text-center font-semibold text-muted-foreground text-sm">
            {t('share.shareVia')}
          </p>
          <div className="flex justify-center gap-3">
            {SHARE_TARGETS.map(target => (
              <a
                key={target.key}
                href={target.getUrl(shareText, TOOL_CONFIG.url)}
                target="_blank"
                rel="noopener noreferrer"
                title={t(target.labelKey)}
                className={cn(
                  'flex size-12 items-center justify-center rounded-full text-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg',
                  target.bgClass
                )}
              >
                {target.icon}
              </a>
            ))}

            <button
              type="button"
              onClick={handleCopy}
              title={copied ? t('share.copied') : t('share.copyLink')}
              className={cn(
                'flex size-12 items-center justify-center rounded-full shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg',
                copied ? 'bg-green-500 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'
              )}
            >
              {copied ? (
                <Check className="size-5" aria-hidden="true" />
              ) : (
                <Copy className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Dismiss option */}
        <div className="px-6 pt-2 pb-5">
          {showDismissOption ? (
            <label
              htmlFor="share-dismiss"
              className="flex cursor-pointer items-center justify-center gap-2 text-muted-foreground text-xs"
            >
              <Checkbox id="share-dismiss" onCheckedChange={handleDismiss} />
              {t('share.hideAfterDownload')}
            </label>
          ) : (
            <p className="text-center text-muted-foreground text-xs">{t('share.freeForever')}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
