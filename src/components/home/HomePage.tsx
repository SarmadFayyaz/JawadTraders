'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'
import { BUSINESS_NAME } from '@/lib/constants'
import Image from 'next/image'

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
      variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
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

const ChickenIcon = ({ size = 'h-10 w-10' }: { size?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" className={size}>
    {/* Body */}
    <ellipse cx="22" cy="30" rx="14" ry="11" className="fill-accent-100 stroke-accent-700" strokeWidth="2" />
    {/* Neck */}
    <path d="M30 24c2-3 4-7 4-11" className="stroke-accent-700" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Head */}
    <circle cx="34" cy="12" r="5" className="fill-accent-100 stroke-accent-700" strokeWidth="2" />
    {/* Eye */}
    <circle cx="36" cy="11" r="1.2" className="fill-accent-800" />
    {/* Beak */}
    <path d="M39 12.5l4-0.5-3 2z" className="fill-accent-400 stroke-accent-600" strokeWidth="0.8" strokeLinejoin="round" />
    {/* Comb */}
    <path d="M31 7.5c0-2 1.5-3.5 3-3.5s1.5 1 2.5 1 1-1 2-1 1.5 1.5 1 3" className="fill-red-400 stroke-red-600" strokeWidth="1" strokeLinejoin="round" />
    {/* Wattle */}
    <path d="M37 15c0.5 1 0.3 2.5-0.5 3" className="stroke-red-400" strokeWidth="1.5" strokeLinecap="round" />
    {/* Wing */}
    <path d="M16 26c3 0 8 2 10 6" className="stroke-accent-500" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M15 28c3 0.5 7 3 8.5 6" className="stroke-accent-400" strokeWidth="1" strokeLinecap="round" fill="none" />
    {/* Tail feathers */}
    <path d="M8 26c-2-4-1-8 1-10" className="stroke-accent-600" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M9 28c-3-3-3-7-1-10" className="stroke-accent-500" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Legs */}
    <path d="M18 40v4M18 44l-2 1M18 44l2 1" className="stroke-accent-600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M26 40v4M26 44l-2 1M26 44l2 1" className="stroke-accent-600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const VegetableIcon = ({ size = 'h-10 w-10' }: { size?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" className={size}>
    <path d="M20 16l-8 24c-.5 1.5.5 2.5 2 2s10-6 12-12" className="fill-accent-100 stroke-accent-700" strokeWidth="2" strokeLinejoin="round" />
    <path d="M24 18c2-4 6-8 12-10-1 6-4 10-8 13" className="fill-accent-200 stroke-accent-700" strokeWidth="2" strokeLinejoin="round" />
    <path d="M22 20c-2-5-1-10 3-14-1 6 0 10 2 13" className="fill-accent-300 stroke-accent-700" strokeWidth="2" strokeLinejoin="round" />
    <path d="M16 28l4-4" className="stroke-accent-600" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const TrustIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10">
    <path d="M20 4L6 10v10c0 9.1 5.9 17.6 14 20 8.1-2.4 14-10.9 14-20V10L20 4z" className="fill-primary-100 stroke-primary-700" strokeWidth="2" />
    <path d="M14 20l4 4 8-8" className="stroke-accent-500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SupplyIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10">
    <rect x="3" y="12" width="20" height="16" rx="2" className="fill-primary-100 stroke-primary-700" strokeWidth="2" />
    <path d="M23 18h6l5 6v4h-11v-10z" className="fill-primary-50 stroke-primary-700" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="11" cy="30" r="3" className="fill-primary-200 stroke-primary-700" strokeWidth="2" />
    <circle cx="30" cy="30" r="3" className="fill-primary-200 stroke-primary-700" strokeWidth="2" />
    <path d="M8 18h8" className="stroke-accent-500" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const FairIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10">
    <path d="M6 16l8-6h4l6 4h4l6-4" className="stroke-primary-700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 16l6 8 4-2 4 4 4-2 4 4 6-6" className="fill-primary-100 stroke-primary-700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="20" cy="22" r="2" className="fill-accent-400" />
  </svg>
)

const CustomerIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10">
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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="M22 7l-10 7L2 7" />
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
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

  const services = [
    {
      image: '/images/gas-cylinders.svg',
      icon: <GasIcon size="h-7 w-7" />,
      title: labels.gasCylinders,
      badge: labels.gasCylindersMainBiz,
      desc: labels.gasCylindersDesc,
      accent: 'primary',
    },
    {
      image: '/images/chicken.svg',
      icon: <ChickenIcon size="h-7 w-7" />,
      title: labels.chickenTrading,
      badge: null,
      desc: labels.chickenTradingDesc,
      accent: 'accent',
    },
    {
      image: '/images/vegetables.svg',
      icon: <VegetableIcon size="h-7 w-7" />,
      title: labels.vegetableTrading,
      badge: null,
      desc: labels.vegetableTradingDesc,
      accent: 'accent',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-900 sm:h-11 sm:w-11">
              <GasIcon size="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary-900 sm:text-2xl">{biz}</span>
          </div>

          <nav className="hidden items-center gap-8 sm:flex">
            <button onClick={() => scrollTo('hero')} className="text-sm font-medium text-gray-500 transition hover:text-primary-800">{labels.home}</button>
            <button onClick={() => scrollTo('services')} className="text-sm font-medium text-gray-500 transition hover:text-primary-800">{labels.ourServices}</button>
            <button onClick={() => scrollTo('about')} className="text-sm font-medium text-gray-500 transition hover:text-primary-800">{labels.navAbout}</button>
            <button onClick={() => scrollTo('contact')} className="text-sm font-medium text-gray-500 transition hover:text-primary-800">{labels.navContact}</button>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleLanguage}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 hover:border-gray-300"
            >
              {locale === 'ur' ? 'EN' : 'اردو'}
            </button>
            <a
              href="https://wa.me/923472889787"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-accent-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-accent-600 hover:shadow-md sm:px-4 sm:text-sm"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{labels.chatOnWhatsApp}</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero with Parallax ── */}
      <section
        id="hero"
        className="parallax-section relative overflow-hidden py-20 text-white sm:py-32 lg:py-40"
        style={{
          backgroundImage: 'linear-gradient(135deg, #102a43 0%, #243b53 40%, #334e68 70%, #102a43 100%)',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dot pattern overlay - stays fixed on scroll */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
            backgroundAttachment: 'fixed',
          }}
        />
        {/* Gradient orbs for depth */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <h1 className="mb-6 pb-2 text-4xl font-extrabold tracking-tight sm:mb-8 sm:text-5xl lg:text-7xl">{biz}</h1>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="text-xl font-medium text-primary-200 sm:text-2xl lg:text-3xl">{labels.tagline}</p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-primary-300/90 sm:text-base lg:text-lg">
                {labels.heroDesc}
              </p>
            </FadeIn>
            <FadeIn delay={0.45}>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <button
                  onClick={() => scrollTo('contact')}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent-500/25 transition hover:bg-accent-600 hover:shadow-xl hover:shadow-accent-500/30 sm:text-base"
                >
                  {labels.heroCta}
                </button>
                <button
                  onClick={() => scrollTo('services')}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 bg-white/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/10 sm:text-base"
                >
                  {labels.ourServices}
                </button>
              </div>
            </FadeIn>
          </div>

          {/* Floating product icons */}
          <FadeIn delay={0.6} className="mt-16 flex items-center justify-center gap-8 sm:gap-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm sm:h-20 sm:w-20">
              <GasIcon size="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm sm:h-20 sm:w-20">
              <ChickenIcon size="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm sm:h-20 sm:w-20">
              <VegetableIcon size="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Services with Images ── */}
      <section id="services" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SlideUp className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-primary-900 sm:text-4xl">{labels.ourServices}</h2>
            <p className="mt-4 text-base text-gray-500">{labels.tagline}</p>
          </SlideUp>

          <StaggerChildren className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {services.map((svc, i) => (
              <StaggerItem key={i} className="flex">
                <div className={`service-card group flex h-full w-full flex-col overflow-hidden rounded-2xl border-2 ${svc.accent === 'primary' ? 'border-primary-200 bg-white' : 'border-gray-200 bg-white'} shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                  {/* Card Image */}
                  <div className="card-image-area relative h-48 sm:h-52">
                    <Image
                      src={svc.image}
                      alt={svc.title}
                      fill
                      className="object-cover"
                    />
                    {svc.badge && (
                      <span className="absolute top-3 left-3 rounded-full bg-primary-900/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                        {svc.badge}
                      </span>
                    )}
                  </div>
                  {/* Card Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${svc.accent === 'primary' ? 'bg-primary-100' : 'bg-accent-100'}`}>
                        {svc.icon}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{svc.title}</h3>
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600">{svc.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── About Us with Image ── */}
      <section
        id="about"
        className="parallax-section relative overflow-hidden py-20 sm:py-28"
        style={{
          backgroundImage: 'linear-gradient(180deg, #f0f4f8 0%, #e2e8f0 50%, #f0f4f8 100%)',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <SlideUp>
              <h2 className="text-3xl font-bold text-primary-900 sm:text-4xl">{labels.aboutUs}</h2>
              <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">{labels.aboutDesc}</p>
              <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">{labels.heroDesc}</p>

              {/* Icons in a row - parallel and bigger */}
              <div className="mt-8 flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 shadow-sm sm:h-20 sm:w-20">
                  <GasIcon size="h-10 w-10 sm:h-12 sm:w-12" />
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-100 shadow-sm sm:h-20 sm:w-20">
                  <ChickenIcon size="h-10 w-10 sm:h-12 sm:w-12" />
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-100 shadow-sm sm:h-20 sm:w-20">
                  <VegetableIcon size="h-10 w-10 sm:h-12 sm:w-12" />
                </div>
              </div>
            </SlideUp>

            <SlideUp>
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/images/about-business.svg"
                  alt={labels.aboutUs}
                  width={800}
                  height={500}
                  className="h-auto w-full"
                />
                {/* Overlay badge */}
                <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 px-5 py-3 shadow-lg backdrop-blur-sm">
                  <p className="text-sm font-bold text-primary-900">{biz}</p>
                  <p className="text-xs text-gray-500">{labels.tagline}</p>
                </div>
              </div>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SlideUp className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-primary-900 sm:text-4xl">{labels.whyChooseUs}</h2>
          </SlideUp>

          <StaggerChildren className="mt-14 grid grid-cols-2 gap-5 sm:gap-8 lg:grid-cols-4">
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
      <section
        id="contact"
        className="parallax-section relative py-20 sm:py-28"
        style={{
          backgroundImage: 'linear-gradient(180deg, #f7fafc 0%, #edf2f7 50%, #f7fafc 100%)',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SlideUp className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-primary-900 sm:text-4xl">{labels.contactUs}</h2>
            <p className="mt-4 text-base text-gray-500">{labels.footerDesc}</p>
          </SlideUp>

          <StaggerChildren className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StaggerItem className="flex">
              <ContactCard icon={<PhoneIcon />} label={labels.phoneWhatsApp} value="+92 347 2889787" href="tel:+923472889787" />
            </StaggerItem>
            <StaggerItem className="flex">
              <ContactCard icon={<MailIcon />} label={labels.emailLabel} value="jawadramzan556@gmail.com" href="mailto:jawadramzan556@gmail.com" />
            </StaggerItem>
            <StaggerItem className="flex">
              <ContactCard icon={<MapPinIcon />} label={labels.serviceArea} value={labels.serviceAreaValue} href="https://maps.app.goo.gl/V9eWjjz7NYUiS6hc8" external />
            </StaggerItem>
            <StaggerItem className="flex">
              <ContactCard icon={<ClockIcon />} label={labels.businessHours} value={labels.businessHoursValue} />
            </StaggerItem>
          </StaggerChildren>

          <SlideUp className="mt-12 text-center">
            <a
              href="https://wa.me/923472889787"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl bg-accent-500 px-10 py-4 text-sm font-bold text-white shadow-lg shadow-accent-500/25 transition hover:bg-accent-600 hover:shadow-xl hover:shadow-accent-500/30 sm:text-base"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {labels.chatOnWhatsApp}
            </a>
          </SlideUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-primary-900 py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <GasIcon size="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{biz}</h3>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-300">{labels.footerDesc}</p>
            </div>
            <div className="flex flex-col gap-3 text-sm text-primary-300 sm:items-end">
              <a href="tel:+923472889787" className="flex items-center gap-3 transition hover:text-white"><PhoneIcon /> +92 347 2889787</a>
              <a href="mailto:jawadramzan556@gmail.com" className="flex items-center gap-3 transition hover:text-white"><MailIcon /> jawadramzan556@gmail.com</a>
              <div className="flex items-center gap-3 whitespace-pre-line"><ClockIcon /> {labels.businessHoursValue}</div>
            </div>
          </div>
          <div className="mt-10 border-t border-primary-800 pt-8 text-center text-xs text-primary-400">
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
    <div className="flex h-full w-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 sm:p-8">
      <div className="mb-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-50">{icon}</div>
      <h4 className="text-base font-bold text-gray-900">{title}</h4>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">{desc}</p>
    </div>
  )
}

function ContactCard({ icon, label, value, href, external }: { icon: React.ReactNode; label: string; value: string; href?: string; external?: boolean }) {
  const content = (
    <>
      <div className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">{icon}</div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-2 flex-1 whitespace-pre-line text-sm font-medium leading-snug text-gray-800">{value}</p>
    </>
  )
  const cls = "flex h-full w-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 sm:p-8"

  if (href) {
    return (
      <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={cls + ' no-underline cursor-pointer'}>
        {content}
      </a>
    )
  }
  return <div className={cls}>{content}</div>
}
