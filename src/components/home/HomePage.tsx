'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'
import { BUSINESS_NAME } from '@/lib/constants'

/* ─── Animation Helpers ─── */
function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SlideUp({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerChildren({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── SVG Icons ─── */

// Gas cylinder icon
const GasIcon = ({ size = 'h-10 w-10' }: { size?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" className={size}>
    <rect x="14" y="10" width="20" height="32" rx="4" className="fill-primary-100 stroke-primary-700" strokeWidth="2" />
    <rect x="18" y="5" width="12" height="6" rx="2" className="fill-primary-200 stroke-primary-700" strokeWidth="2" />
    <circle cx="24" cy="26" r="6" className="fill-primary-200 stroke-primary-700" strokeWidth="2" />
    <path d="M24 22v8M20 26h8" className="stroke-primary-700" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M36 18v6" className="stroke-primary-400" strokeWidth="2" strokeLinecap="round" />
    <circle cx="36" cy="16" r="2" className="fill-primary-300 stroke-primary-700" strokeWidth="1.5" />
  </svg>
)

// Chicken drumstick icon
const ChickenIcon = ({ size = 'h-10 w-10' }: { size?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" className={size}>
    <path d="M28 8c-7 0-12 5-12 12 0 3 1 5.5 2.5 7.5L12 38c-.5 1 0 2 1 2.5l2 1c1 .5 2 0 2.5-1l6-10c1.5.5 3 .8 4.5.8 7 0 12-5 12-12S35 8 28 8z" className="fill-accent-100 stroke-accent-700" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="30" cy="17" r="2" className="fill-accent-700" />
    <path d="M34 14c1.5-1.5 3.5-1 4 .5" className="stroke-accent-500" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 21c-1 .5-1.5 1.5-1 2.5" className="stroke-accent-400" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

// Carrot + leaf vegetable icon
const VegetableIcon = ({ size = 'h-10 w-10' }: { size?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" className={size}>
    <path d="M20 16l-8 24c-.5 1.5.5 2.5 2 2s10-6 12-12" className="fill-accent-100 stroke-accent-700" strokeWidth="2" strokeLinejoin="round" />
    <path d="M24 18c2-4 6-8 12-10-1 6-4 10-8 13" className="fill-accent-200 stroke-accent-700" strokeWidth="2" strokeLinejoin="round" />
    <path d="M22 20c-2-5-1-10 3-14-1 6 0 10 2 13" className="fill-accent-300 stroke-accent-700" strokeWidth="2" strokeLinejoin="round" />
    <path d="M16 28l4-4" className="stroke-accent-600" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

// Shield with checkmark — Trust
const TrustIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
    <path d="M20 4L6 10v10c0 9.1 5.9 17.6 14 20 8.1-2.4 14-10.9 14-20V10L20 4z" className="fill-primary-100 stroke-primary-700" strokeWidth="2" />
    <path d="M14 20l4 4 8-8" className="stroke-accent-500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Delivery truck — Consistent Supply
const SupplyIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
    <rect x="3" y="12" width="20" height="16" rx="2" className="fill-primary-100 stroke-primary-700" strokeWidth="2" />
    <path d="M23 18h6l5 6v4h-11v-10z" className="fill-primary-50 stroke-primary-700" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="11" cy="30" r="3" className="fill-primary-200 stroke-primary-700" strokeWidth="2" />
    <circle cx="30" cy="30" r="3" className="fill-primary-200 stroke-primary-700" strokeWidth="2" />
    <path d="M8 18h8" className="stroke-accent-500" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// Handshake — Fair Dealing
const FairIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
    <path d="M6 16l8-6h4l6 4h4l6-4" className="stroke-primary-700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 16l6 8 4-2 4 4 4-2 4 4 6-6" className="fill-primary-100 stroke-primary-700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="20" cy="22" r="2" className="fill-accent-400" />
  </svg>
)

// Heart in hand — Customer Focused
const CustomerIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
    <path d="M8 34c0-2 1-4 3-5l6-3c1-.5 2-.5 3 0l6 3c2 1 3 3 3 5" className="fill-primary-50 stroke-primary-700" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 14c1.5-2 4-2.5 5.5-1s1.5 4-1 6L20 24l-4.5-5c-2.5-2-2-4.5-.5-6s4-1 5 1z" className="fill-accent-200 stroke-accent-600" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
)

const WhatsAppIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="M22 7l-10 7L2 7" />
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

/* ─── Main Component ─── */
export function HomePage() {
  const { labels, locale, toggleLanguage } = useLanguage()
  const biz = BUSINESS_NAME[locale]

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <span className="text-lg font-bold tracking-tight text-primary-900 sm:text-xl">{biz}</span>

          <nav className="hidden items-center gap-6 sm:flex">
            <button onClick={() => scrollTo('hero')} className="text-sm font-medium text-gray-600 transition hover:text-primary-800">{labels.home}</button>
            <button onClick={() => scrollTo('about')} className="text-sm font-medium text-gray-600 transition hover:text-primary-800">{labels.navAbout}</button>
            <button onClick={() => scrollTo('contact')} className="text-sm font-medium text-gray-600 transition hover:text-primary-800">{labels.navContact}</button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              {locale === 'ur' ? 'EN' : 'اردو'}
            </button>
            <a
              href="https://wa.me/923472889787"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-accent-600 sm:px-4 sm:text-sm"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{labels.chatOnWhatsApp}</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section id="hero" className="relative overflow-hidden bg-primary-900 py-16 text-white sm:py-28">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
          <FadeIn>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{biz}</h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-lg font-medium text-primary-200 sm:text-xl lg:text-2xl">{labels.tagline}</p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-primary-300 sm:text-base">
              {labels.heroDesc}
            </p>
          </FadeIn>
          <FadeIn delay={0.45}>
            <button
              onClick={() => scrollTo('contact')}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-accent-600 hover:shadow-xl sm:text-base"
            >
              {labels.heroCta}
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SlideUp>
            <h2 className="mb-12 text-center text-2xl font-bold text-primary-900 sm:text-3xl">{labels.ourServices}</h2>
          </SlideUp>

          <StaggerChildren className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Gas Cylinders — Primary */}
            <StaggerItem className="flex">
              <div className="flex h-full flex-col rounded-2xl border-2 border-primary-200 bg-primary-50 p-6 transition hover:shadow-lg sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-200/60">
                    <GasIcon size="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary-900">{labels.gasCylinders}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-500">{labels.gasCylindersMainBiz}</span>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600">{labels.gasCylindersDesc}</p>
              </div>
            </StaggerItem>

            {/* Chicken */}
            <StaggerItem className="flex">
              <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 transition hover:shadow-lg sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-100/60">
                    <ChickenIcon size="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{labels.chickenTrading}</h3>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600">{labels.chickenTradingDesc}</p>
              </div>
            </StaggerItem>

            {/* Vegetables */}
            <StaggerItem className="flex">
              <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 transition hover:shadow-lg sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-100/60">
                    <VegetableIcon size="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{labels.vegetableTrading}</h3>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600">{labels.vegetableTradingDesc}</p>
              </div>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:grid-cols-2 sm:px-6">
          <SlideUp>
            <h2 className="text-2xl font-bold text-primary-900 sm:text-3xl">{labels.aboutUs}</h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">{labels.aboutDesc}</p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">{labels.heroDesc}</p>
          </SlideUp>
          <SlideUp>
            <div className="flex flex-col items-center justify-center gap-6 rounded-2xl bg-white p-8 shadow-sm">
              <GasIcon size="h-16 w-16" />
              <div className="flex gap-6">
                <ChickenIcon size="h-14 w-14" />
                <VegetableIcon size="h-14 w-14" />
              </div>
              <p className="text-center text-sm font-medium text-gray-500">{labels.tagline}</p>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SlideUp>
            <h2 className="mb-12 text-center text-2xl font-bold text-primary-900 sm:text-3xl">{labels.whyChooseUs}</h2>
          </SlideUp>

          <StaggerChildren className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            <StaggerItem className="flex">
              <WhyCard icon={<TrustIcon />} title={labels.trustedLocal} desc={labels.trustedLocalDesc} />
            </StaggerItem>
            <StaggerItem className="flex">
              <WhyCard icon={<SupplyIcon />} title={labels.consistentSupply} desc={labels.consistentSupplyDesc} />
            </StaggerItem>
            <StaggerItem className="flex">
              <WhyCard icon={<FairIcon />} title={labels.fairDealing} desc={labels.fairDealingDesc} />
            </StaggerItem>
            <StaggerItem className="flex">
              <WhyCard icon={<CustomerIcon />} title={labels.customerFocused} desc={labels.customerFocusedDesc} />
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SlideUp>
            <h2 className="mb-12 text-center text-2xl font-bold text-primary-900 sm:text-3xl">{labels.contactUs}</h2>
          </SlideUp>

          <StaggerChildren className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            <StaggerItem className="flex">
              <ContactCard icon={<PhoneIcon />} label={labels.phoneWhatsApp} value="+92 347 2889787" />
            </StaggerItem>
            <StaggerItem className="flex">
              <ContactCard icon={<MailIcon />} label={labels.emailLabel} value="jawadramzan556@gmail.com" />
            </StaggerItem>
            <StaggerItem className="flex">
              <ContactCard icon={<MapPinIcon />} label={labels.serviceArea} value={labels.serviceAreaValue} />
            </StaggerItem>
            <StaggerItem className="flex">
              <ContactCard icon={<ClockIcon />} label={labels.businessHours} value={labels.businessHoursValue} />
            </StaggerItem>
          </StaggerChildren>

          <SlideUp className="mt-10 text-center">
            <a
              href="https://wa.me/923472889787"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-accent-600 hover:shadow-xl sm:text-base"
            >
              <WhatsAppIcon />
              {labels.chatOnWhatsApp}
            </a>
          </SlideUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-primary-900 py-12 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-xl font-bold">{biz}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-primary-300">{labels.footerDesc}</p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-primary-300 sm:items-end">
              <div className="flex items-center gap-2"><PhoneIcon /> +92 347 2889787</div>
              <div className="flex items-center gap-2"><MailIcon /> jawadramzan556@gmail.com</div>
              <div className="flex items-center gap-2"><ClockIcon /> {labels.businessHoursValue}</div>
            </div>
          </div>
          <div className="mt-8 border-t border-primary-800 pt-6 text-center text-xs text-primary-400">
            &copy; {new Date().getFullYear()} {biz}. {labels.allRightsReserved}.
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ─── Sub-components ─── */
function WhyCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex h-full flex-col items-center rounded-xl border border-gray-200 bg-white p-5 text-center transition hover:shadow-md sm:p-6">
      <div className="mb-3 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-50">{icon}</div>
      <h4 className="font-bold text-gray-900">{title}</h4>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-gray-500">{desc}</p>
    </div>
  )
}

function ContactCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex h-full flex-col items-center rounded-xl border border-gray-200 bg-white p-5 text-center transition hover:shadow-md">
      <div className="mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">{icon}</div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-1 flex-1 text-sm font-medium text-gray-800">{value}</p>
    </div>
  )
}
