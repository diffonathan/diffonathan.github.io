import { useState } from 'react'
import type { FormEvent } from 'react'
import { Send } from 'lucide-react'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import { contact, identity, socials } from '../data/portfolio'

type FormStatus = 'idle' | 'sending' | 'success' | 'error' | 'mailto'

/**
 * Formulaire branché sur Formspree (gratuit, sans backend).
 * Configurez VITE_FORMSPREE_ENDPOINT dans .env (voir .env.example).
 * Sans endpoint configuré, le formulaire bascule sur un mailto pré-rempli.
 */
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined

export default function Contact() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const labels = contact.formLabels

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return
    const form = event.currentTarget
    const data = new FormData(form)

    // Repli sans backend : ouvre le client mail avec le message pré-rempli
    if (!FORMSPREE_ENDPOINT) {
      const subject = encodeURIComponent(`Contact portfolio — ${data.get('name')}`)
      const body = encodeURIComponent(
        `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`,
      )
      setStatus('mailto')
      window.location.href = `mailto:${identity.email}?subject=${subject}&body=${body}`
      return
    }

    setStatus('sending')
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) throw new Error(`Formspree ${response.status}`)
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={contact.title} subtitle={contact.subtitle} />

        <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
          {/* Coordonnées directes */}
          <Reveal>
            <div className="space-y-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target={social.url.startsWith('http') ? '_blank' : undefined}
                  rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="card card-hover flex items-center gap-4 p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/[0.12] text-accent">
                    <social.icon size={20} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{social.label}</span>
                    <span className="block break-all text-sm text-secondary">
                      {social.url.replace('mailto:', '').replace('https://www.', '')}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </Reveal>

          {/* Formulaire */}
          <Reveal delay={0.1}>
            <form className="card p-6 sm:p-8" onSubmit={handleSubmit} noValidate={false}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-name" className="text-sm font-medium">
                    {labels.name} <span className="text-accent" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder={labels.namePlaceholder}
                    className="min-h-11 rounded-lg border border-border bg-surface px-4 py-3 text-base placeholder:text-secondary/70 focus:border-accent"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-email" className="text-sm font-medium">
                    {labels.email} <span className="text-accent" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={labels.emailPlaceholder}
                    className="min-h-11 rounded-lg border border-border bg-surface px-4 py-3 text-base placeholder:text-secondary/70 focus:border-accent"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <label htmlFor="contact-message" className="text-sm font-medium">
                  {labels.message} <span className="text-accent" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={6}
                  placeholder={labels.messagePlaceholder}
                  className="resize-y rounded-lg border border-border bg-surface px-4 py-3 text-base placeholder:text-secondary/70 focus:border-accent"
                />
              </div>

              {/* Piège anti-spam Formspree (invisible) */}
              <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              <button
                type="submit"
                aria-busy={status === 'sending'}
                className={`btn-primary mt-6 w-full sm:w-auto ${
                  status === 'sending' ? 'cursor-wait opacity-60' : ''
                }`}
              >
                <Send size={17} aria-hidden="true" />
                {status === 'sending' ? labels.sending : labels.submit}
              </button>

              {/* Retour d'état annoncé aux lecteurs d'écran */}
              <p aria-live="polite" className="mt-4 min-h-5 text-sm">
                {status === 'success' && <span className="text-success">{labels.success}</span>}
                {status === 'mailto' && <span className="text-secondary">{labels.mailtoInfo}</span>}
                {status === 'error' && (
                  <span className="text-danger">
                    {labels.error}{' '}
                    <a href={`mailto:${identity.email}`} className="underline">
                      {identity.email}
                    </a>
                  </span>
                )}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
