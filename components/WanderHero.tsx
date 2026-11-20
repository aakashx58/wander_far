'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  BedDouble,
  Plane,
  Compass,
  MapPin,
  Calendar,
  Users,
  Search,
  X,
  Minus,
  Plus,
  Check,
  ArrowRight,
} from 'lucide-react';

type TabKey = 'stays' | 'flights' | 'experiences';
type ActivePopover = 'destination' | 'dates' | 'travelers' | null;

interface DestinationOption {
  name: string;
  region: string;
  airport: string;
  coord: string;
}

const DESTINATIONS: DestinationOption[] = [
  { name: 'Molde', region: 'Møre og Romsdal, Norge', airport: 'MOL', coord: '62.74° N' },
  { name: 'Geiranger', region: 'Geirangerfjord, Norge', airport: 'AES', coord: '62.10° N' },
  { name: 'Ålesund', region: 'Sunnmøre Alps, Norge', airport: 'AES', coord: '62.47° N' },
  { name: 'Loen', region: 'Nordfjord, Norge', airport: 'SDN', coord: '61.87° N' },
  { name: 'Aurland', region: 'Aurlandsfjord, Norge', airport: 'BGO', coord: '60.90° N' },
  { name: 'Reine', region: 'Lofoten, Norge', airport: 'LKN', coord: '67.93° N' },
];

const DATE_PRESETS = [
  'Jun 18 – Jun 24',
  'Jul 04 – Jul 11',
  'Jul 22 – Jul 29',
  'Aug 09 – Aug 15',
  'Sep 03 – Sep 08',
];

const STILL_SRC =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/bd8d16a6-ac46-4cb8-bf0b-fb8e732ed31a.webp';
const VIDEO_SRC =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/62b7e754-022b-4512-9b96-513173cb2e14.mp4';

interface ResultItem {
  id: string;
  title: string;
  subtitle: string;
  detail: string;
  price: string;
  unit: string;
}

function getCuratedResults(
  tab: TabKey,
  destination: string,
  dates: string,
  travelers: number
): ResultItem[] {
  if (tab === 'flights') {
    const destObj = DESTINATIONS.find((d) => d.name === destination) ?? DESTINATIONS[0];
    return [
      {
        id: 'flt-1',
        title: `Oslo (OSL) → ${destObj.name} (${destObj.airport})`,
        subtitle: `Morning departure · 07:40 – 08:35 · Nonstop`,
        detail: `${dates} · ${travelers} ${travelers === 1 ? 'passenger' : 'passengers'}`,
        price: `$${148 * travelers}`,
        unit: 'total',
      },
      {
        id: 'flt-2',
        title: `Bergen (BGO) → ${destObj.name} (${destObj.airport})`,
        subtitle: `Coastal fjord hop · 11:15 – 12:05 · Nonstop`,
        detail: `${dates} · ${travelers} ${travelers === 1 ? 'passenger' : 'passengers'}`,
        price: `$${132 * travelers}`,
        unit: 'total',
      },
      {
        id: 'flt-3',
        title: `Oslo (OSL) → ${destObj.name} (${destObj.airport})`,
        subtitle: `Blue hour evening · 18:20 – 19:15 · Nonstop`,
        detail: `${dates} · ${travelers} ${travelers === 1 ? 'passenger' : 'passengers'}`,
        price: `$${164 * travelers}`,
        unit: 'total',
      },
    ];
  }

  if (tab === 'experiences') {
    return [
      {
        id: 'exp-1',
        title: `Silent Electric Fjord Cruise · ${destination}`,
        subtitle: 'Guided 3-hour morning crossing beneath the waterfalls',
        detail: `${dates} · ${travelers} ${travelers === 1 ? 'guest' : 'guests'}`,
        price: `$${95 * travelers}`,
        unit: 'total',
      },
      {
        id: 'exp-2',
        title: `Cedar Sauna & Cold Fjord Plunge`,
        subtitle: 'Private floating timber sauna moored at dusk',
        detail: `${dates} · ${travelers} ${travelers === 1 ? 'guest' : 'guests'}`,
        price: `$${120 * travelers}`,
        unit: 'total',
      },
      {
        id: 'exp-3',
        title: `High-Ridge Dawn Walk & Mountain Coffee`,
        subtitle: 'Local mountain guide · Small trail above the cliff line',
        detail: `${dates} · ${travelers} ${travelers === 1 ? 'guest' : 'guests'}`,
        price: `$${110 * travelers}`,
        unit: 'total',
      },
    ];
  }

  return [
    {
      id: 'stay-1',
      title: `Shoreline Red Boathouse · ${destination}`,
      subtitle: 'Private timber pier · Wood stove · 2 bedrooms',
      detail: `${dates} · Up to 4 guests`,
      price: '$310',
      unit: '/ night',
    },
    {
      id: 'stay-2',
      title: `Cliffside Glass & Pine Cabin · ${destination}`,
      subtitle: 'Panoramic fjord terrace · Cedar sauna · 2 bedrooms',
      detail: `${dates} · Up to 4 guests`,
      price: '$385',
      unit: '/ night',
    },
    {
      id: 'stay-3',
      title: `Old Pier Timber Lodge · ${destination}`,
      subtitle: 'Rowboat included · Quiet eastern cove · 3 bedrooms',
      detail: `${dates} · Up to 6 guests`,
      price: '$440',
      unit: '/ night',
    },
  ];
}

export default function WanderHero() {
  const [activeTab, setActiveTab] = useState<TabKey>('stays');
  const [destination, setDestination] = useState<string>('Molde');
  const [dates, setDates] = useState<string>('Jun 18 – Jun 24');
  const [travelers, setTravelers] = useState<number>(3);
  const [openPopover, setOpenPopover] = useState<ActivePopover>(null);
  const [resultsOpen, setResultsOpen] = useState<boolean>(false);
  const [reservedId, setReservedId] = useState<string | null>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [videoReady, setVideoReady] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const searchWrapRef = useRef<HTMLDivElement | null>(null);

  // Detect prefers-reduced-motion cleanly on client
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setPrefersReducedMotion(mq.matches);
    syncPreference();
    mq.addEventListener('change', syncPreference);
    return () => mq.removeEventListener('change', syncPreference);
  }, []);

  // Ensure cached video fades in immediately if first frame is already ready
  useEffect(() => {
    if (prefersReducedMotion) return;
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.readyState >= 2) {
      setVideoReady(true);
    }

    const playPromise = vid.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Autoplay fallback handled silently; still photo remains visible
      });
    }
  }, [prefersReducedMotion]);

  // Close popovers / modal on outside click or Escape
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (
        openPopover &&
        searchWrapRef.current &&
        !searchWrapRef.current.contains(e.target as Node)
      ) {
        setOpenPopover(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenPopover(null);
        setResultsOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openPopover]);

  const tabCopy = {
    stays: {
      col1Label: 'Where to?',
      col2Label: 'Dates',
      col3Label: 'Travelers',
      col3Value: `${travelers} ${travelers === 1 ? 'traveler' : 'travelers'}`,
    },
    flights: {
      col1Label: 'Fly to',
      col2Label: 'Dates',
      col3Label: 'Passengers',
      col3Value: `${travelers} ${travelers === 1 ? 'passenger' : 'passengers'}`,
    },
    experiences: {
      col1Label: 'Fjord region',
      col2Label: 'Dates',
      col3Label: 'Group',
      col3Value: `${travelers} ${travelers === 1 ? 'guest' : 'guests'}`,
    },
  }[activeTab];

  const results = getCuratedResults(activeTab, destination, dates, travelers);

  const handleSearch = () => {
    setOpenPopover(null);
    setReservedId(null);
    setResultsOpen(true);
  };

  return (
    <main className="hero-shell">
      {/* 1. Header row */}
      <header className="hero-header">
        <h1 className="hero-headline">
          <span className="hero-line-mask">
            <span className="anim-line-1">Wander far.</span>
          </span>
          <span className="hero-line-mask">
            <span className="anim-line-2">Rest easy.</span>
          </span>
        </h1>

        <p className="hero-lede anim-lede">
          Find quiet fjords, cozy cabins, and the slow, wild
          <br />
          mornings you came for, all here in one place.
        </p>
      </header>

      {/* 2. Tabs */}
      <nav className="hero-tabs anim-tabs" role="tablist" aria-label="Travel categories">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'stays'}
          onClick={() => {
            setActiveTab('stays');
            setOpenPopover(null);
          }}
          className="hero-tab-btn"
        >
          <BedDouble
            size={16}
            strokeWidth={1.5}
            style={{ color: activeTab === 'stays' ? '#0A2A72' : 'currentColor' }}
          />
          <span>Stays</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'flights'}
          onClick={() => {
            setActiveTab('flights');
            setOpenPopover(null);
          }}
          className="hero-tab-btn"
        >
          <Plane
            size={16}
            strokeWidth={1.5}
            style={{ color: activeTab === 'flights' ? '#0A2A72' : 'currentColor' }}
          />
          <span>Flights</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'experiences'}
          onClick={() => {
            setActiveTab('experiences');
            setOpenPopover(null);
          }}
          className="hero-tab-btn"
        >
          <Compass
            size={16}
            strokeWidth={1.5}
            style={{ color: activeTab === 'experiences' ? '#0A2A72' : 'currentColor' }}
          />
          <span>Experiences</span>
        </button>
      </nav>

      {/* 3. Search bar */}
      <div className="search-panel-wrap anim-search" ref={searchWrapRef}>
        <div className="search-panel" role="search">
          {/* Cell 1: Destination */}
          <button
            type="button"
            aria-expanded={openPopover === 'destination'}
            onClick={() =>
              setOpenPopover((prev) => (prev === 'destination' ? null : 'destination'))
            }
            className="search-cell"
          >
            <span className="search-cell-label">{tabCopy.col1Label}</span>
            <span className="search-cell-value-row">
              <MapPin size={16} strokeWidth={1.65} className="search-cell-icon" />
              <span className="search-cell-value">{destination}</span>
            </span>
          </button>

          {/* Cell 2: Dates */}
          <button
            type="button"
            aria-expanded={openPopover === 'dates'}
            onClick={() => setOpenPopover((prev) => (prev === 'dates' ? null : 'dates'))}
            className="search-cell"
          >
            <span className="search-cell-label">{tabCopy.col2Label}</span>
            <span className="search-cell-value-row">
              <Calendar size={16} strokeWidth={1.65} className="search-cell-icon" />
              <span className="search-cell-value">{dates}</span>
            </span>
          </button>

          {/* Cell 3: Travelers */}
          <button
            type="button"
            aria-expanded={openPopover === 'travelers'}
            onClick={() =>
              setOpenPopover((prev) => (prev === 'travelers' ? null : 'travelers'))
            }
            className="search-cell"
          >
            <span className="search-cell-label">{tabCopy.col3Label}</span>
            <span className="search-cell-value-row">
              <Users size={16} strokeWidth={1.65} className="search-cell-icon" />
              <span className="search-cell-value">{tabCopy.col3Value}</span>
            </span>
          </button>

          {/* Cell 4: Search Button */}
          <div className="search-action-cell">
            <button
              type="button"
              onClick={handleSearch}
              className="search-submit-btn anim-btn"
            >
              <Search size={16} strokeWidth={1.8} />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Interactive Popovers */}
        {openPopover === 'destination' && (
          <div
            role="dialog"
            aria-label="Choose destination"
            className="absolute left-0 top-full mt-2 w-full max-w-md bg-[#FEFEFE] border border-[#E6E6E7] shadow-lg z-30 p-2"
          >
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6E7070] border-b border-[#E6E6E7]">
              Nordic destinations
            </div>
            <div className="divide-y divide-[#E6E6E7]">
              {DESTINATIONS.map((item) => {
                const selected = item.name === destination;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setDestination(item.name);
                      setOpenPopover(null);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-[#F7F8FA] transition-colors"
                  >
                    <div>
                      <div className="text-[14px] font-medium text-[#0B0E0C]">
                        {item.name}
                      </div>
                      <div className="text-[12px] text-[#6E7070]">{item.region}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-coord text-[11px] text-[#6E7070]">
                        {item.coord}
                      </span>
                      {selected && (
                        <Check size={15} strokeWidth={2} className="text-[#0A2A72]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {openPopover === 'dates' && (
          <div
            role="dialog"
            aria-label="Choose travel dates"
            className="absolute left-0 md:left-1/3 top-full mt-2 w-full max-w-sm bg-[#FEFEFE] border border-[#E6E6E7] shadow-lg z-30 p-2"
          >
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6E7070] border-b border-[#E6E6E7]">
              Summer windows
            </div>
            <div className="divide-y divide-[#E6E6E7]">
              {DATE_PRESETS.map((preset) => {
                const selected = preset === dates;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setDates(preset);
                      setOpenPopover(null);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-[#F7F8FA] transition-colors"
                  >
                    <span className="text-[14px] font-medium text-[#222223]">
                      {preset}
                    </span>
                    {selected && (
                      <Check size={15} strokeWidth={2} className="text-[#0A2A72]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {openPopover === 'travelers' && (
          <div
            role="dialog"
            aria-label="Select travelers"
            className="absolute right-0 md:right-[140px] top-full mt-2 w-full max-w-xs bg-[#FEFEFE] border border-[#E6E6E7] shadow-lg z-30 p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[14px] font-medium text-[#0B0E0C]">
                  {tabCopy.col3Label}
                </div>
                <div className="text-[12px] text-[#6E7070]">Adults &amp; children</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Decrease travelers"
                  onClick={() => setTravelers((n) => Math.max(1, n - 1))}
                  className="w-8 h-8 flex items-center justify-center border border-[#E6E6E7] text-[#222223] hover:bg-[#F7F8FA] transition-colors"
                >
                  <Minus size={14} strokeWidth={1.75} />
                </button>
                <span className="w-5 text-center text-[15px] font-medium tabular-nums text-[#0B0E0C]">
                  {travelers}
                </span>
                <button
                  type="button"
                  aria-label="Increase travelers"
                  onClick={() => setTravelers((n) => Math.min(10, n + 1))}
                  className="w-8 h-8 flex items-center justify-center border border-[#E6E6E7] text-[#222223] hover:bg-[#F7F8FA] transition-colors"
                >
                  <Plus size={14} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Photo panel (never animates in code; only the video moves) */}
      <section className="photo-panel" aria-label="Geirangerfjord, Norge at blue hour">
        <Image
          src={STILL_SRC}
          alt="Still Norwegian fjord at blue hour with steep dark cliffs, low clouds, snowy peaks, a tall waterfall on the right, and a lit red cabin by glassy water"
          fill
          priority
          sizes="(max-width: 820px) 100vw, 92vw"
          referrerPolicy="no-referrer"
          className="fjord-media"
        />

        {!prefersReducedMotion && (
          <video
            ref={videoRef}
            className={`fjord-media fjord-video${videoReady ? ' is-ready' : ''}`}
            src={VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            onLoadedData={() => setVideoReady(true)}
            onCanPlay={() => setVideoReady(true)}
            onPlaying={() => setVideoReady(true)}
          />
        )}

        <div className="location-chip">
          <span className="location-chip-name">Geirangerfjord, Norge</span>
          <span className="location-chip-coord">62.10° N</span>
        </div>
      </section>

      {/* Search Results Drawer / Modal */}
      {resultsOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setResultsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Available fjord options"
        >
          <div
            className="w-full max-w-2xl bg-[#FEFEFE] border border-[#E6E6E7] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[#E6E6E7]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.085em] text-[#6E7070]">
                  {activeTab} · {destination}
                </p>
                <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-[#0B0E0C]">
                  {dates} · {tabCopy.col3Value}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close search results"
                onClick={() => setResultsOpen(false)}
                className="w-9 h-9 flex items-center justify-center border border-[#E6E6E7] text-[#222223] hover:bg-[#F7F8FA] transition-colors"
              >
                <X size={16} strokeWidth={1.75} />
              </button>
            </div>

            <div className="divide-y divide-[#E6E6E7]">
              {results.map((item) => {
                const isReserved = reservedId === item.id;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5"
                  >
                    <div className="min-w-0">
                      <h3 className="text-[16px] font-semibold text-[#0B0E0C]">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-[14px] text-[#727274]">{item.subtitle}</p>
                      <p className="mt-1 text-[12px] text-[#6E7070]">{item.detail}</p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[18px] font-semibold tabular-nums text-[#0B0E0C]">
                          {item.price}
                        </span>{' '}
                        <span className="text-[12px] text-[#6E7070]">{item.unit}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setReservedId(item.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium transition-colors whitespace-nowrap ${
                          isReserved
                            ? 'bg-[#F0F4FA] text-[#0A2A72] border border-[#0A2A72]'
                            : 'bg-[#00286E] text-[#FEFEFE] hover:bg-[#001E54]'
                        }`}
                      >
                        {isReserved ? (
                          <>
                            <Check size={14} strokeWidth={2} />
                            <span>Hold requested</span>
                          </>
                        ) : (
                          <>
                            <span>Select</span>
                            <ArrowRight size={14} strokeWidth={1.75} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
