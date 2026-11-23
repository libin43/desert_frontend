import { useSite } from '@/hooks/useSite'
import { cn } from '@/lib/cn'
import { SITES } from '@/features/sites/data/sites'
import { CAMPS } from './data/camps'
import { formatAed } from './format'

/** One camp per site. Choosing a camp switches the whole page to that site. */
export function CampList() {
  const { site, setSiteId } = useSite()

  return (
    <div role="radiogroup" aria-label="Guided camp" className="flex flex-col gap-4">
      {CAMPS.map((camp) => {
        const campSite = SITES.find((s) => s.id === camp.siteId)!
        const selected = camp.siteId === site.id
        return (
          <button
            key={camp.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setSiteId(camp.siteId)}
            className={cn(
              'rounded-3xl border p-6 text-left transition-colors sm:p-8',
              selected
                ? 'border-star-400/70 bg-white/[0.06]'
                : 'border-white/12 hover:border-white/30',
            )}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display-light text-heading text-mist-100">{camp.name}</h3>
              <p className="tabular shrink-0 text-mist-100">
                {formatAed(camp.pricePerGuestAed)}
                <span className="text-sm text-mist-400"> a guest</span>
              </p>
            </div>
            <p className="mt-1 text-sm text-mist-400">
              {campSite.name}, {camp.format.toLowerCase()}, meet at {camp.startsAt}, up to{' '}
              {camp.maxGuests} guests
            </p>
            {selected && (
              <>
                <p className="mt-5 max-w-[56ch] text-mist-300">{camp.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-mist-300">
                  {camp.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span aria-hidden="true" className="size-1 rounded-full bg-star-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}
