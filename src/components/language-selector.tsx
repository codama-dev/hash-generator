import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const LANGUAGES = [
  { code: 'en', flag: '🇺🇸', labelKey: 'language.en' as const },
  { code: 'de', flag: '🇩🇪', labelKey: 'language.de' as const },
  { code: 'es', flag: '🇪🇸', labelKey: 'language.es' as const },
  { code: 'he', flag: '🇮🇱', labelKey: 'language.he' as const },
] as const

export function LanguageSelector() {
  const { t, i18n } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label={t('language.label')}>
          <span className="text-lg leading-none" aria-hidden>
            {LANGUAGES.find(l => l.code === i18n.language)?.flag ?? '🌐'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map(({ code, flag, labelKey }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => i18n.changeLanguage(code)}
            className={i18n.language === code ? 'bg-accent' : ''}
          >
            <span className="mr-2" aria-hidden>
              {flag}
            </span>
            {t(labelKey)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
