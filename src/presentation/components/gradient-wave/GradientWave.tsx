import './GradientWave.css'
import type { GradientWaveProps } from './GradientWave.types'

export function GradientWave({ className = '' }: GradientWaveProps) {
  return (
    <div
      className={`gradient-wave ${className}`.trim()}
      aria-hidden="true"
      role="presentation"
    >
      <span className="gradient-wave__blob gradient-wave__blob--1" />
      <span className="gradient-wave__blob gradient-wave__blob--2" />
      <span className="gradient-wave__blob gradient-wave__blob--3" />
      <span className="gradient-wave__blob gradient-wave__blob--4" />
      <span className="gradient-wave__blob gradient-wave__blob--5" />
      <span className="gradient-wave__blob gradient-wave__blob--fuchsia" />
      <span className="gradient-wave__blob gradient-wave__blob--indigo" />
      <span className="gradient-wave__blob gradient-wave__blob--cyan" />
      <span className="gradient-wave__blob gradient-wave__blob--magenta" />
      <span className="gradient-wave__blob gradient-wave__blob--amber" />
      <span className="gradient-wave__blob gradient-wave__blob--white-sweep" />
      <span className="gradient-wave__blob gradient-wave__blob--white-sweep-accent" />
    </div>
  )
}
