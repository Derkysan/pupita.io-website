export interface HeroTag {
  label: string
}

export interface HeroProps {
  title?: React.ReactNode
  chipLabel?: string
  leftCaption?: string
  rightCaption?: string
  tags?: HeroTag[]
  onChipClick?: () => void
  onExpandClick?: () => void
  onRefreshClick?: () => void
}
