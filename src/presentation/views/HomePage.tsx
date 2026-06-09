import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TextAnimate } from "../components/text-pull-up"
import { MdOutlineEmail, MdClose, MdArrowOutward } from "react-icons/md"
import { ContactForm } from "../components/contact-form"

const EASE = [0.22, 1, 0.36, 1] as const

const MAILTO =
  `mailto:contact@pupita.io` +
  `?subject=${encodeURIComponent('Hola desde Pupita.io')}` +
  `&body=${encodeURIComponent(
    'Hola equipo de Pupita,\n\nMe interesa conocer más sobre sus servicios de desarrollo.\n\nProyecto / Consulta:\n[Cuéntanos sobre tu idea o proyecto]\n\nQuedo atento.'
  )}`

export function HomePage() {
  const [isContactOpen, setIsContactOpen] = useState(false)

  return (
    <main className="bg-mauve-900 h-svh flex flex-col px-5 md:px-10 py-4">
      <div className="flex flex-col flex-1 md:grid md:grid-rows-8 h-full">

        {/* Row 1: Logo + About */}
        <div className="flex-3 min-h-0 overflow-hidden md:overflow-visible relative flex flex-col gap-6 pt-6 pb-6 md:grid md:grid-cols-5 md:gap-10 md:row-span-3 md:pt-8 md:pb-0">

          {/* Left: About text / Contact title */}
          <div className="overflow-hidden h-full flex flex-col order-2 md:order-1 md:col-span-2 md:text-right">
            <AnimatePresence mode="wait">
              {!isContactOpen ? (
                <motion.h1
                  key="about"
                  className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl pb-8"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.4, ease: EASE } }}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.3, ease: EASE } }}
                >
                  Transformamos ideas en productos digitales que funcionan. Diseño, ingeniería y estrategia al servicio de marcas que quieren dejar huella en el mundo digital.
                </motion.h1>
              ) : (
                <motion.div
                  key="contact-title"
                  className="flex flex-col gap-1 md:items-end mt-auto"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } }}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.3, ease: EASE } }}
                >
                  <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-white leading-tight normal-case tracking-normal">
                    Hagámoslo<span className="text-pink-400">.</span>
                  </h2>
                  <p className="text-gray-500 text-sm normal-case tracking-normal font-normal">Sin filtros. Sin burocracia. Solo tu idea y nosotros.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Logo + button */}
          <div className="flex flex-col justify-between order-1 md:order-2 md:col-span-3 uppercase tracking-widest font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-right text-white pb-6">
            <div>
              <TextAnimate mode="letters" stagger={0.025} duration={0.4}>PUPITA</TextAnimate>
              <span className="text-pink-400"><TextAnimate mode="letters" stagger={0.025} duration={0.4} delay={0.12}>.</TextAnimate></span>
              <TextAnimate mode="letters" stagger={0.025} duration={0.4} delay={0.15}>IO</TextAnimate>
            </div>
            <div className="flex flex-col items-end gap-2">
              <motion.div
                className="hidden md:flex justify-end"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.4, duration: 0.4, ease: EASE }}
              >
                <a
                  href={MAILTO}
                  className="group flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors duration-200 normal-case tracking-normal font-normal"
                >
                  contact@pupita.io
                  <MdArrowOutward className="text-base group-hover:text-pink-400 transition-colors duration-200" />
                </a>
              </motion.div>

              {/* Línea corta bajo el botón — solo desktop */}
              <motion.div
                className="hidden md:block w-full h-px bg-gray-600"
                animate={{ scaleX: isContactOpen ? 1 : 0, opacity: isContactOpen ? 1 : 0 }}
                style={{ originX: 1 }}
                transition={{ duration: 0.4, delay: isContactOpen ? 0.15 : 0, ease: EASE }}
              />
            </div>
          </div>

          {/* Línea completa — solo desktop */}
          <motion.div
            className="hidden md:block absolute md:bottom-6 left-0 right-0 h-px bg-gray-600"
            animate={{ scaleX: isContactOpen ? 0 : 1, opacity: isContactOpen ? 0 : 1 }}
            style={{ originX: 1 }}
            transition={{ duration: 0.4, delay: isContactOpen ? 0 : 0.15, ease: EASE }}
          />
        </div>

        {/* Línea separadora — solo mobile, en flujo normal entre filas */}
        <motion.div
          className="md:hidden flex-none h-px bg-gray-600"
          animate={{ opacity: isContactOpen ? 0 : 1 }}
          transition={{ duration: 0.3, ease: EASE }}
        />

        {/* Row 2: Contenido normal / Formulario */}
        <div className="flex-4 min-h-0 overflow-hidden text-white md:row-span-4 py-4 md:py-0">
          <AnimatePresence mode="wait">
            {!isContactOpen ? (
              <motion.div
                key="normal"
                className="h-full grid grid-cols-1 md:grid-cols-5 md:gap-10"
                exit={{ opacity: 0, y: -8, transition: { duration: 0.3, ease: EASE } }}
              >
                <div className="hidden md:grid md:col-span-2 relative">
                  <motion.span
                    className="absolute md:text-[12em] lg:text-[16em] xl:text-[20em] text-mauve-800 opacity-50 leading-tight h-60"
                    initial={{ opacity: 0, rotate: -30, scale: 0.85 }}
                    whileInView={{ opacity: 0.5, rotate: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25, duration: 0.85, ease: EASE }}
                  >*</motion.span>
                </div>
                <div className="flex flex-col justify-end md:col-span-2">
                  <div className="flex flex-col gap-3">
                    <motion.h3
                      className="text-xl md:text-2xl lg:text-3xl"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.85, duration: 0.4, ease: EASE }}
                    >
                      Del concepto al código.
                    </motion.h3>
                    <motion.p
                      className="text-gray-500 text-sm md:text-base"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.0, duration: 0.4, ease: EASE }}
                    >
                      Desarrollamos aplicaciones web y móviles, sistemas a medida y plataformas digitales que escalan con tu negocio. Trabajamos con equipos que tienen grandes ideas y necesitan un socio técnico que las haga realidad, sin burocracia y con foco en el resultado.
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                className="h-full flex items-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <ContactForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Row 3: Footer */}
        <div className="flex-1 min-h-0 text-white flex items-center md:grid md:grid-cols-5 md:gap-10 md:row-span-1">

          {/* Mobile footer: copyright | button | powered by */}
          <div className="flex md:hidden w-full items-center justify-between text-xs">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.75 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4, duration: 0.5, ease: "easeOut" }}
            >
              © Copyright <span className="text-pink-300">2026</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4, duration: 0.4, ease: EASE }}
            >
              <a
                href={MAILTO}
                className="group flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors duration-200 normal-case tracking-normal font-normal"
              >
                contact@pupita.io
                <MdArrowOutward className="text-sm group-hover:text-pink-400 transition-colors duration-200" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.75 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4, duration: 0.5, ease: "easeOut" }}
            >
              <span className="text-gray-500">Powered by PUPITA.IO</span>
            </motion.div>
          </div>

          {/* Desktop footer */}
          <motion.div
            className="hidden md:flex w-full justify-between text-xs md:col-span-2 gap-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.75 }}
            viewport={{ once: true }}
            transition={{ delay: 1.4, duration: 0.5, ease: "easeOut" }}
          >
            <div>© Copyright <span className="text-pink-300">2026</span></div>
            <span className="text-gray-500">Powered by PUPITA.IO</span>
          </motion.div>

          <div className="hidden md:flex md:col-span-3">
            <div className="w-full text-xs text-gray-500"></div>
          </div>
        </div>

      </div>
    </main>
  )
}
