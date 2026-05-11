"use client"

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Play, Pause, Music } from 'lucide-react'
import {
  getRadioMetadata,
  getRadioStations,
  getRadioStreamUrl,
  RadioStation,
} from '../api/streamApi'
import VolumeControl from './VolumeControl'

const VOLUME_STORAGE_KEY = 'netradio_widget_volume'
const STATION_STORAGE_KEY = 'netradio_widget_station_id'
const VOLUME_STEP = 5

const NetRadioWidget: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const streamTitleRef = useRef<HTMLParagraphElement | null>(null)
  const [stations, setStations] = useState<RadioStation[]>([])
  const [selectedStationId, setSelectedStationId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [streamTitle, setStreamTitle] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window === 'undefined') return 80
    const stored = window.localStorage.getItem(VOLUME_STORAGE_KEY)
    const parsed = stored ? Number(stored) : Number.NaN
    return !Number.isNaN(parsed) && Number.isFinite(parsed) 
      ? Math.min(100, Math.max(0, parsed)) 
      : 80
  })

  const selectedStation = useMemo(
    () => stations.find((station) => station.id === selectedStationId),
    [stations, selectedStationId],
  )

  useEffect(() => {
    const loadStations = async () => {
      setIsLoading(true)
      try {
        const response = await getRadioStations()
        setStations(response)
        if (response.length > 0) {
          const savedStationId = window.localStorage.getItem(STATION_STORAGE_KEY)
          const savedStationExists = response.some(
            (station) => station.id === savedStationId,
          )
          setSelectedStationId(
            savedStationExists && savedStationId
              ? savedStationId
              : response[0].id,
          )
        }
        setErrorMessage('')
      } catch {
        setErrorMessage('Failed to load radio stations.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadStations()
  }, [])

  useEffect(() => {
    if (!selectedStationId) return
    window.localStorage.setItem(STATION_STORAGE_KEY, selectedStationId)
  }, [selectedStationId])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = volume / 100
    window.localStorage.setItem(VOLUME_STORAGE_KEY, String(volume))
  }, [volume])

  const playSelectedStation = async () => {
    const audio = audioRef.current
    if (!audio || !selectedStation) return

    try {
      audio.pause()
      audio.src = getRadioStreamUrl(selectedStation.id)
      audio.load()
      await audio.play()
      setIsPlaying(true)
      setErrorMessage('')
    } catch {
      setIsPlaying(false)
      setErrorMessage('Unable to start radio stream.')
    }
  }

  const pausePlayback = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    setIsPlaying(false)
  }

  const onStationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStationId = event.target.value
    setSelectedStationId(nextStationId)
    setStreamTitle(null)

    if (isPlaying && audioRef.current) {
      const switchStation = async () => {
        try {
          const audio = audioRef.current
          if (!audio) return
          audio.pause()
          audio.src = getRadioStreamUrl(nextStationId)
          audio.load()
          await audio.play()
          setErrorMessage('')
        } catch {
          setIsPlaying(false)
          setErrorMessage('Station not supported.')
        }
      }
      void switchStation()
    }
  }

  const loadMetadata = useCallback(async (stationId: string) => {
    try {
      const metadata = await getRadioMetadata(stationId)
      setStreamTitle(metadata.streamTitle)
    } catch {
      setStreamTitle(null)
    }
  }, [])

  useEffect(() => {
    if (!isPlaying || !selectedStationId) return

    void loadMetadata(selectedStationId)

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void loadMetadata(selectedStationId)
      }
    }, 60000)

    return () => window.clearInterval(intervalId)
  }, [isPlaying, selectedStationId, loadMetadata])

  const changeVolume = (delta: number) => {
    setVolume((prev) => Math.min(100, Math.max(0, prev + delta)))
  }

  return (
    <>
      {isMinimized ? (
        <button 
          onClick={() => setIsMinimized(false)}
          className="radio-minimized-btn shadow-lg animate-in zoom-in duration-200"
        >
          <Music size={20} className={isPlaying ? "animate-pulse text-blue-400" : ""} />
        </button>
      ) : (
        <section className="radio-widget shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="radio-content">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`} />
                 Zen Radio
              </h3>
              <button 
                onClick={() => setIsMinimized(true)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                 <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <VolumeControl
                    volume={volume}
                    onIncrease={() => changeVolume(VOLUME_STEP)}
                    onDecrease={() => changeVolume(-VOLUME_STEP)}
                  />
                  
                  <div className="flex-1">
                    {isPlaying ? (
                      <button
                        onClick={pausePlayback}
                        className="radio-play-btn pause shadow-inner"
                        aria-label="Pause"
                      >
                        <Pause fill="currentColor" size={24} />
                      </button>
                    ) : (
                      <button
                        onClick={() => void playSelectedStation()}
                        className="radio-play-btn play shadow-lg"
                        aria-label="Play"
                      >
                        <Play fill="currentColor" size={24} className="ml-1" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={selectedStationId}
                    onChange={onStationChange}
                    className="radio-select"
                  >
                    {stations.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {errorMessage && (
              <p className="text-[10px] text-red-400 mt-2 text-center">{errorMessage}</p>
            )}

            <div className="mt-4 border-t border-white/10 pt-3">
              <p
                ref={streamTitleRef}
                className="radio-stream-title"
                title={streamTitle || undefined}
              >
                {streamTitle || '- - -'}
              </p>
            </div>
          </div>
        </section>
      )}

      <audio
        ref={audioRef}
        preload="none"
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false)
          setErrorMessage('Stream error.')
        }}
      />
    </>
  )
}

import { ChevronDown } from 'lucide-react'

export default NetRadioWidget
