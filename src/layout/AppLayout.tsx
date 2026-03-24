import { Menu } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { LanguageSelector } from '@/components/language-selector'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { PageFooter } from '@/pages/PageFooter'

interface AppLayoutProps {
  children: React.ReactNode
}

const navLinkClass =
  'text-muted-foreground text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm'
const navLinkActiveClass = 'text-foreground'

function MainNav({ className = '' }: { className?: string }) {
  const { t } = useTranslation()
  return (
    <nav className={`flex items-center gap-4 ${className}`} aria-label="Main">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `${navLinkClass} ${isActive ? navLinkActiveClass : ''}`}
      >
        {t('nav.home')}
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) => `${navLinkClass} ${isActive ? navLinkActiveClass : ''}`}
      >
        {t('nav.about')}
      </NavLink>
      <a
        href="https://codama.dev/#colophon"
        target="_blank"
        rel="noopener noreferrer"
        className={navLinkClass}
      >
        {t('nav.getAQuote')}
      </a>
    </nav>
  )
}

export function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border border-b bg-background px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          <div className="flex min-w-0 flex-1 items-center gap-8">
            <div className="min-w-0 overflow-hidden">
              <p className="truncate font-semibold text-base text-foreground sm:text-xl">
                {t('app.title')}
              </p>
              <p className="hidden text-muted-foreground text-sm sm:block">{t('app.tagline')}</p>
            </div>
            <div className="hidden h-8 w-px shrink-0 bg-border md:block" aria-hidden />
            <div className="hidden md:block md:pl-2">
              <MainNav />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  aria-label={t('nav.openMenu')}
                >
                  <Menu className="size-5" aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                hideClose
                className="flex w-full flex-col gap-0 border-l bg-background px-0 sm:max-w-xs"
              >
                <SheetHeader className="flex flex-row items-center justify-between border-border border-b px-6 py-4">
                  <SheetTitle className="font-semibold text-foreground text-lg">
                    {t('nav.menu')}
                  </SheetTitle>
                  <SheetClose
                    aria-label={t('nav.closeMenu')}
                    className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                  >
                    <span className="sr-only">{t('nav.closeMenu')}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-5"
                      aria-hidden
                    >
                      <title>{t('nav.closeMenu')}</title>
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </SheetClose>
                </SheetHeader>
                <nav className="flex flex-col py-2" aria-label="Main">
                  <NavLink
                    to="/"
                    end
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-6 py-3 text-left font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
                        isActive
                          ? 'border-primary border-l-4 bg-accent/50 text-foreground'
                          : 'border-transparent border-l-4 text-muted-foreground hover:bg-accent/30 hover:text-foreground'
                      }`
                    }
                  >
                    {t('nav.home')}
                  </NavLink>
                  <NavLink
                    to="/about"
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-6 py-3 text-left font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
                        isActive
                          ? 'border-primary border-l-4 bg-accent/50 text-foreground'
                          : 'border-transparent border-l-4 text-muted-foreground hover:bg-accent/30 hover:text-foreground'
                      }`
                    }
                  >
                    {t('nav.about')}
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu()
                      window.open('https://codama.dev/#colophon', '_blank', 'noopener,noreferrer')
                    }}
                    className="flex w-full items-center gap-3 border-transparent border-l-4 px-6 py-3 text-left font-medium text-muted-foreground text-sm transition-colors hover:bg-accent/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  >
                    {t('nav.getAQuote')}
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
            <LanguageSelector />
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 bg-background p-6">{children}</main>

      <PageFooter />
    </div>
  )
}
