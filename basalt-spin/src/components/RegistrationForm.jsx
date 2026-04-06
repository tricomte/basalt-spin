import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { NeonText } from './NeonText'

const SUBTITLE =
  '> Enter your credentials to access the system_'

function TypewriterLine({ text, active }) {
  const [shown, setShown] = useState('')
  useEffect(() => {
    if (!active) {
      setShown('')
      return
    }
    let i = 0
    setShown('')
    const id = window.setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) window.clearInterval(id)
    }, 38)
    return () => window.clearInterval(id)
  }, [active, text])
  return (
    <p className="typewriter-cursor min-h-[1.25rem] font-mono text-xs tracking-wide text-[rgba(0,240,255,0.55)] md:text-sm">
      {shown}
    </p>
  )
}

function TerminalInput({ placeholder, type, autoComplete, value, onChange }) {
  return (
    <div className="group relative">
      <label className="sr-only">{placeholder}</label>
      <input
        className="relative z-[1] w-full rounded border border-basalt-cyan/50 bg-black/60 px-3 py-3 font-mono text-sm text-white/95 outline-none ring-0 transition placeholder:text-[rgba(0,240,255,0.28)] focus:border-basalt-cyan focus:shadow-[0_0_0_1px_rgba(0,240,255,0.5),0_0_22px_rgba(0,240,255,0.18)] md:px-4 md:py-3.5"
        placeholder={placeholder}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] overflow-hidden rounded opacity-0 transition duration-200 group-focus-within:opacity-100"
      >
        <span className="input-scan-line absolute inset-y-0 left-0 w-[32%] bg-gradient-to-r from-transparent via-basalt-cyan/50 to-transparent" />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded opacity-0 transition group-focus-within:opacity-100 group-focus-within:shadow-[inset_0_0_20px_rgba(0,240,255,0.08)]"
      />
    </div>
  )
}

export function RegistrationForm({ onSubmit }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      company: company.trim(),
      email: email.trim(),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(12px)', scale: 0.98 }}
      transition={{ duration: 0.55 }}
      className="relative z-10 mx-auto w-full max-w-lg px-4 md:px-8"
    >
      <div className="mb-8 text-center md:mb-10">
        <NeonText
          as="h1"
          color="cyan"
          className="font-orbitron text-3xl font-black tracking-[0.18em] text-basalt-cyan md:text-5xl"
        >
          SPIN TO WIN
        </NeonText>
        <div className="mt-5 px-2">
          <TypewriterLine text={SUBTITLE} active />
        </div>
      </div>

      <div className="terminal-shell rounded-sm border border-basalt-cyan/40 bg-[#06060a]/92 p-1 shadow-[0_0_40px_rgba(0,240,255,0.06)] backdrop-blur-md md:rounded-md">
        <div className="flex items-center gap-2 border-b border-basalt-cyan/25 bg-black/50 px-3 py-2 font-mono text-[10px] text-basalt-cyan/70 md:text-xs">
          <span className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          </span>
          <span className="tracking-widest text-white/50">AGENT_REGISTRATION.exe</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4 md:space-y-5 md:p-6">
          <TerminalInput
            placeholder="first_name"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TerminalInput
            placeholder="last_name"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TerminalInput
            placeholder="company"
            type="text"
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <TerminalInput
            placeholder="email_address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="w-full rounded border-2 border-basalt-cyan bg-basalt-cyan/5 py-4 font-orbitron text-[10px] font-bold tracking-[0.22em] text-basalt-cyan shadow-[0_0_24px_rgba(0,240,255,.28)] transition-colors duration-150 hover:bg-basalt-cyan/12 active:bg-basalt-cyan/20 md:text-xs md:tracking-[0.28em]"
          >
            INITIALIZE SPIN PROTOCOL
          </button>
        </form>
      </div>
    </motion.div>
  )
}
