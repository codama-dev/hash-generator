import { Code2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const SERVICE_KEYS = ['webApps', 'mobile', 'automation', 'dataBi', 'businessWebsites'] as const

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-4xl space-y-16 pb-12">
      {/* Intro */}
      <section className="rounded-xl border bg-muted/30 px-6 py-6 sm:px-8 sm:py-8">
        <p className="text-base text-muted-foreground leading-relaxed sm:text-lg">
          {t('about.intro')}
        </p>
      </section>

      {/* Hero */}
      <section className="space-y-6 text-center">
        <h1 className="font-bold text-3xl text-foreground tracking-tight sm:text-4xl">
          {t('about.hero.title')}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {t('about.hero.subtitle')}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <a
              href="https://codama.dev/#colophon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              {t('about.getAQuote')}
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/">{t('about.backToTool')}</Link>
          </Button>
        </div>
      </section>

      {/* Our Services */}
      <section className="space-y-8">
        <h2 className="text-center font-semibold text-2xl text-foreground sm:text-3xl">
          {t('about.ourServices')}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          {SERVICE_KEYS.map(key => (
            <Card key={key} className="overflow-hidden transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Code2 className="size-5" aria-hidden />
                  <CardTitle className="text-xl">{t(`about.services.${key}.title`)}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 3].map(i => (
                    <span
                      key={i}
                      className="rounded-md bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs"
                    >
                      {t(`about.services.${key}.tag${i}`)}
                    </span>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {t(`about.services.${key}.description`)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why choose Codama */}
      <section className="rounded-xl border bg-muted/40 px-6 py-8 text-center sm:px-10">
        <h2 className="mb-4 font-semibold text-foreground text-xl sm:text-2xl">
          {t('about.whyChoose.title')}
        </h2>
        <blockquote className="mx-auto max-w-2xl text-lg text-muted-foreground italic leading-relaxed">
          {t('about.whyChoose.quote')}
        </blockquote>
      </section>
    </div>
  )
}
