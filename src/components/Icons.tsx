type IconProps = { size?: number }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.3,
  'aria-hidden': true,
})

export const SearchIcon = ({ size = 24 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5 21 21" />
  </svg>
)

export const BagIcon = ({ size = 24 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M4 8.5h16v12H4z" />
    <path d="M8.5 8.5V5.5h7v3" />
  </svg>
)

export const MenuIcon = ({ size = 24 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M3 6.5h18M3 12h18M3 17.5h18" />
  </svg>
)

export const CloseIcon = ({ size = 24 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M5 5l14 14M19 5 5 19" />
  </svg>
)

export const ChevronIcon = ({ size = 20, back = false }: IconProps & { back?: boolean }) => (
  <svg {...base(size)} className={back ? 'chevron chevron--back' : 'chevron'}>
    <path d="m9 5 7 7-7 7" />
  </svg>
)

export const PlusIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
