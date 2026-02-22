'use client'

import { useState, useEffect, useCallback } from 'react'

export interface SiteSettings {
  profileName: string
  profilePic: string
  profileMood: string
  profileBio: string
  musicTitle: string
  musicArtist: string
  musicAlbumArt: string
  musicYoutubeId: string
  aboutMeImage: string
  aboutMeText: string
  meetImage: string
  backgroundImage: string
  introGif: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  textColor: string
  bgColor: string
}

const defaultSettings: SiteSettings = {
  profileName: 'const.js',
  profilePic: 'https://i.pinimg.com/736x/c9/f2/8e/c9f28eface6424b8c4284664e83e4f2c.jpg',
  profileMood: 'studying',
  profileBio: 'im a guy',
  musicTitle: '420',
  musicArtist: 'MACINTOSH PLUS',
  musicAlbumArt: 'https://m.media-amazon.com/images/I/81BbQMTakEL._UF1000,1000_QL80_.jpg',
  musicYoutubeId: 'hI302pJcB5Y',
  aboutMeImage: 'https://64.media.tumblr.com/5019b04d38d5c58b8d826eb8b9f22f39/34275822159c4776-88/s400x600/0f21dc869dad6bd910791ee4a685be5756e5af62.pnj',
  aboutMeText: 'I love coding, anime, and late-night programming sessions! 💻🌙',
  meetImage: 'https://i.pinimg.com/originals/b1/45/61/b14561c3f4a5078244f7ccaf62f6bd53.gif',
  backgroundImage: 'https://media1.tenor.com/m/zVOKTGRnA8kAAAAd/water-lake.gif',
  introGif: 'https://media1.tenor.com/m/7yzbOZ0f8PcAAAAC/cute.gif',
  primaryColor: '#b07ded',
  secondaryColor: '#9b6dd9',
  accentColor: '#c9abff',
  textColor: '#e0b0ff',
  bgColor: 'rgba(30, 20, 50, 0.7)'
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/settings')
      if (!res.ok) throw new Error('Failed to load settings')
      const data = await res.json()
      if (data.settings) {
        setSettings({
          profileName: data.settings.profileName || defaultSettings.profileName,
          profilePic: data.settings.profilePic || defaultSettings.profilePic,
          profileMood: data.settings.profileMood || defaultSettings.profileMood,
          profileBio: data.settings.profileBio || defaultSettings.profileBio,
          musicTitle: data.settings.musicTitle || defaultSettings.musicTitle,
          musicArtist: data.settings.musicArtist || defaultSettings.musicArtist,
          musicAlbumArt: data.settings.musicAlbumArt || defaultSettings.musicAlbumArt,
          musicYoutubeId: data.settings.musicYoutubeId || defaultSettings.musicYoutubeId,
          aboutMeImage: data.settings.aboutMeImage || defaultSettings.aboutMeImage,
          aboutMeText: data.settings.aboutMeText || defaultSettings.aboutMeText,
          meetImage: data.settings.meetImage || defaultSettings.meetImage,
          backgroundImage: data.settings.backgroundImage || defaultSettings.backgroundImage,
          introGif: data.settings.introGif || defaultSettings.introGif,
          primaryColor: data.settings.primaryColor || defaultSettings.primaryColor,
          secondaryColor: data.settings.secondaryColor || defaultSettings.secondaryColor,
          accentColor: data.settings.accentColor || defaultSettings.accentColor,
          textColor: data.settings.textColor || defaultSettings.textColor,
          bgColor: data.settings.bgColor || defaultSettings.bgColor,
        })
      }
    } catch (err) {
      console.error('Failed to load settings:', err)
      setError('Failed to load settings')
      // Keep default settings on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return { settings, loading, error, reload: loadSettings }
}
