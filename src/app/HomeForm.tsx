// src/app/HomeForm.tsx
'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { languageNames, Language } from '@/lib/translations';
// 🚫 REMOVE the Metadata import and export if they were present here.

// Renaming the component
export default function HomeForm() {
  const { language, setLanguage, t } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Language Selector */}
      <nav className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex gap-2" aria-label="Language selector">
        {(['en', 'ar', 'am'] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-3 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-all ${language === lang
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
              : 'bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
          >
            {languageNames[lang]}
          </button>
        ))}
      </nav>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl md:text-2xl" role="img" aria-label="Books">📚</span>
              </div>
              <span className="text-white font-bold text-lg md:text-2xl">{t.brandName}</span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto w-full">
            {/* Hero Section */}
            <section className="text-center mb-12 md:mb-16">
              <p className="text-purple-400 font-semibold mb-2 md:mb-4 text-sm md:text-base tracking-wide uppercase">{t.tagline}</p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto mb-2 md:mb-4">
                {t.heroSubtitle}
              </p>
              <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto">
                {t.heroDescription}
              </p>
            </section>

            {/* Survey Cards - Using Semantic Article Tags */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">

              {/* Student Survey Card */}
              <article className="group h-full">
                <div className="h-full flex flex-col p-6 md:p-8 bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02]">
                  <div className="mb-4 md:mb-6 grow">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                      <span className="text-2xl md:text-4xl" role="img" aria-label="Student Cap">🎓</span>
                    </div>
                    <p className="text-xs md:text-sm text-purple-400 font-semibold mb-1 md:mb-2">{t.forStudents}</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">{t.studentSurveyTitle}</h2>
                    <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                      {t.studentSurveyDesc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300">{t.studentFeature1}</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300">{t.studentFeature2}</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300">{t.studentFeature3}</span>
                  </div>

                  <Link
                    href="/student-survey"
                    className="block w-full py-3 md:py-4 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all text-center text-sm md:text-base"
                  >
                    {t.startSurvey} →
                  </Link>
                </div>
              </article>

              {/* Teacher Survey Card */}
              <article className="group h-full">
                <div className="h-full flex flex-col p-6 md:p-8 bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20 hover:scale-[1.02]">
                  <div className="mb-4 md:mb-6 grow">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                      <span className="text-2xl md:text-4xl" role="img" aria-label="Teacher">👨‍🏫</span>
                    </div>
                    <p className="text-xs md:text-sm text-purple-400 font-semibold mb-1 md:mb-2">{t.forTeachers}</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">{t.teacherSurveyTitle}</h2>
                    <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                      {t.teacherSurveyDesc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300">{t.teacherFeature1}</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300">{t.teacherFeature2}</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300">{t.teacherFeature3}</span>
                  </div>

                  <Link
                    href="/teacher-survey"
                    className="block w-full py-3 md:py-4 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all text-center text-sm md:text-base"
                  >
                    {t.startSurvey} →
                  </Link>
                </div>
              </article>
            </div>

            {/* Features/Trust Indicators */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
              <div className="text-center p-4 md:p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-3xl md:text-4xl mb-2 md:mb-3" role="img" aria-label="Secure">🔒</div>
                <h3 className="font-semibold text-white text-sm md:text-base mb-1">{t.anonymous}</h3>
                <p className="text-xs md:text-sm text-gray-400">{t.anonymousDesc}</p>
              </div>
              <div className="text-center p-4 md:p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-3xl md:text-4xl mb-2 md:mb-3" role="img" aria-label="Fast">⚡</div>
                <h3 className="font-semibold text-white text-sm md:text-base mb-1">{t.quickEasy}</h3>
                <p className="text-xs md:text-sm text-gray-400">{t.quickEasyDesc}</p>
              </div>
              <div className="text-center p-4 md:p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-3xl md:text-4xl mb-2 md:mb-3" role="img" aria-label="Impact">✨</div>
                <h3 className="font-semibold text-white text-sm md:text-base mb-1">{t.makeImpact}</h3>
                <p className="text-xs md:text-sm text-gray-400">{t.makeImpactDesc}</p>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto text-center flex flex-col items-center gap-2">
            <p className="text-xs md:text-sm text-gray-500">{t.footerText}</p>
            <Link href="/admin/login" className="text-gray-600 hover:text-gray-400 transition-colors" aria-label="Admin Login">
              <span className="sr-only">{t.adminLogin}</span>
              <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}