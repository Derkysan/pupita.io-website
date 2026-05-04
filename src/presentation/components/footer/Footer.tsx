import { TextAnimate } from '../text-pull-up'
import type { FooterProps } from './Footer.types'

export function Footer({
  copyright = `© ${new Date().getFullYear()}`,
  children,
  className = '',
}: FooterProps) {
  return (
    <footer className={`h-20 ${className}`.trim()}>
      <div className="max-w-10/12 lg:max-w-11/12 h-full flex items-center mx-auto relative z-20 text-xs text-gray-950 font-mono">
        <TextAnimate mode="letters" direction="right" stagger={0.04}>{children ?? <span>{copyright}</span>}</TextAnimate>
      </div>
    </footer>
  )
}
