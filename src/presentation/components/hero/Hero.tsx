import { Footer } from '../footer'
import { GlassBackdrop } from '../glass-backdrop'
import { Header } from '../header'
import { TextAnimate } from '../text-pull-up'
import type { HeroProps } from './Hero.types'

export function Hero({}: HeroProps) {
  return (
    <section className="w-full h-svh flex flex-col relative bg-gray-100">
      <GlassBackdrop />

      <Header />

      <div className="flex-1 relative z-50">
        <div className="grid grid-cols-1 max-w-10/12 lg:max-w-11/12 h-full mx-auto items-center">
          <div className="space-y-4 lg:space-y-6">
            <h1 className="font-heading tracking-tighter text-7xl lg:text-8xl">
              <TextAnimate mode="letters" className="font-thin leading-[1.15em]">Soluciones Tech</TextAnimate><br/>
              <TextAnimate mode="letters" className="font-light leading-[1.15em]" delay={.25}>Profesionales</TextAnimate>
            </h1>
            <p className="text-base lg:text-xl font-light">
              <TextAnimate delay={.5}>Diseñamos & construimos herramientas y productos para profesionales.</TextAnimate>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  )
}
