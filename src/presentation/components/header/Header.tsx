import { TextAnimate } from '../text-pull-up'
import type { HeaderProps } from './Header.types'

export function Header({ logo = 'pupita.io', right, className = '' }: HeaderProps) {
  return (
    <header className={`h-20 ${className}`.trim()}>
      <nav className="max-w-10/12 lg:max-w-11/12 h-full flex items-center mx-auto relative z-40">
        <div className="uppercase tracking-widest font-bold">
          <TextAnimate mode="letters" stagger={0.04}>{logo}</TextAnimate>
        </div>
        {/* <div className="flex ml-auto">
          <motion.a
            href="mailto:"
            className="w-8 flex items-center justify-center rounded-full aspect-square text-gray-700 hover:text-gray-900 hover:bg-gray-100 hover:scale-125 transition-all ease-in-out"
            initial={{ opacity: 0, scale: 0.25 }}
            animate={{ opacity: 1, scale: 1.1 }}
            transition={{ duration: 0.4, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <MdOutlineMailOutline />
          </motion.a>
        </div> */}
        {right && <div className="ml-auto">{right}</div>}
      </nav>
    </header>
  )
}
