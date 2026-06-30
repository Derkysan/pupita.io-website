import { HeroSliderRoot, useHeroSlider } from './HeroSlider'
import { HeroSliderCard } from './HeroSlider.Card'
import { HeroSliderThumbnail } from './HeroSlider.Thumbnail'

export const HeroSlider = Object.assign(HeroSliderRoot, {
  Card: HeroSliderCard,
  Thumbnail: HeroSliderThumbnail,
})

export { useHeroSlider }
export type { SlideItem } from './HeroSlider.types'
