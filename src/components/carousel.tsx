import { useCallback, useEffect, useState, type ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type CarouselProps = {
  children: ReactNode
  /** Tailwind da largura de cada slide (basis). Ex.: 'basis-full', 'sm:basis-1/2 lg:basis-1/4' */
  slideClassName?: string
  autoplay?: boolean
  autoplayDelay?: number
  loop?: boolean
  className?: string
  showArrows?: boolean
  showDots?: boolean
}

export const Carousel = ({
  children,
  slideClassName = 'basis-full',
  autoplay = false,
  autoplayDelay = 5000,
  loop = true,
  className,
  showArrows = true,
  showDots = false,
}: CarouselProps) => {
  const plugins = autoplay
    ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })]
    : []
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, align: 'start' }, plugins)
  const [selected, setSelected] = useState(0)
  const [snaps, setSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    setSnaps(emblaApi.scrollSnapList())
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi])

  const items = Array.isArray(children) ? children : [children]

  return (
    <div className={cn('relative', className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((child, i) => (
            <div key={i} className={cn('min-w-0 shrink-0 grow-0 px-2', slideClassName)}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Anterior"
            className="absolute left-1 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-primary/80 text-white shadow-lg transition hover:bg-primary"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Seguinte"
            className="absolute right-1 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-primary/80 text-white shadow-lg transition hover:bg-primary"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}

      {showDots && snaps.length > 1 && (
        // Dots DENTRO do hero (base da imagem), com sombra pra contraste sobre a foto —
        // elimina a faixa branca solta entre o carrossel e a próxima secção.
        <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2 [&>button]:shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir para o slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                'h-2.5 rounded-full transition-all',
                i === selected ? 'w-6 bg-accent' : 'w-2.5 bg-white/70 hover:bg-white',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
