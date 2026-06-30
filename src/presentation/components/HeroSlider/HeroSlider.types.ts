export interface SlideItem {
  image: string
  route: string
  title: string
  description: string
}

export interface HeroSliderContextValue {
  slides: SlideItem[]
  currentIndex: number
  next: () => void
  prev: () => void
  goTo: (index: number) => void
  autoPlay: boolean
  interval: number
  showProgress: boolean
}
