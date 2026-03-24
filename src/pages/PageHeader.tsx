import { useTranslation } from 'react-i18next'

export function PageHeader() {
  const { t } = useTranslation()
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 px-6 py-16 text-center shadow-lg sm:px-8 sm:py-20">
      <div className="relative z-10 mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-balance font-bold text-4xl text-white tracking-tight sm:text-5xl md:text-6xl">
            {t('pageHeader.title')}
          </h1>
          <p className="mt-4 text-balance text-lg text-white/90 sm:text-xl">
            {t('pageHeader.subtitle')}
          </p>
        </div>
      </div>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
    </header>
  )
}
