import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TextAnimate } from "../components/text-pull-up"
import { MdArrowOutward } from "react-icons/md"
import { ContactForm } from "../components/contact-form"
import { LandingPage1 } from "./LandingPage1"
import { LandingPage2 } from "./LandingPage2"

const EASE = [0.22, 1, 0.36, 1] as const

const MAILTO =
  `mailto:contact@pupita.io` +
  `?subject=${encodeURIComponent('Hola desde Pupita.io')}` +
  `&body=${encodeURIComponent(
    'Hola equipo de Pupita,\n\nMe interesa conocer más sobre sus servicios de desarrollo.\n\nProyecto / Consulta:\n[Cuéntanos sobre tu idea o proyecto]\n\nQuedo atento.'
  )}`

export function HomePage() {
  const [isContactOpen] = useState(false)

  return (
    <main className="bg-mauve-900 min-h-svh lg:h-svh flex flex-col px-5 md:px-10 py-4">
      {/* <LandingPage1 /> */}
      <LandingPage2 />
    </main>
  )
}
