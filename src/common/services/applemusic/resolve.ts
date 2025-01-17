import { asArray } from '../../utils/array'
import { stringToDate } from '../../utils/datetime'
import { fetch } from '../../utils/fetch'
import { getReleaseType } from '../../utils/music'
import { isDefined, isUndefined } from '../../utils/types'
import { ResolveFunction } from '../types'

const getUrl = (document_: Document) =>
  document_.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href

const getTitle = (document_: Document) =>
  document_.querySelector('.product-name')?.textContent?.trim()

const getArtists = (document_: Document) =>
  [...document_.querySelectorAll('.product-creator a')]
    .map((element) => element.textContent?.trim())
    .filter(isDefined)

const getDate = (document_: Document) => {
  const dateString = document_.querySelector<HTMLMetaElement>(
    'meta[property="music:release_date"]'
  )?.content
  return isUndefined(dateString) ? undefined : stringToDate(dateString)
}

const getTracks = (document_: Document) =>
  [...document_.querySelectorAll('.songs-list-row')].map((element) => {
    const position = element
      .querySelector('.songs-list-row__column-data')
      ?.textContent?.trim()
    const title = element
      .querySelector('.songs-list-row__song-name')
      ?.textContent?.trim()
    const duration = element
      .querySelector('.songs-list-row__length')
      ?.textContent?.trim()
    return { position, title, duration }
  })

const getCoverArt = (document_: Document) => {
  const element = document_.querySelector<HTMLSourceElement>(
    '.product-lockup picture source[type="image/jpeg"]'
  )
  const firstLink = element?.srcset.split(', ')[0]?.split(' ')[0]
  if (isUndefined(firstLink)) return undefined

  // replace the last occurrence of 000x000 with 2400x2400
  const splits = firstLink.split('/')
  splits[splits.length - 1] =
    splits[splits.length - 1]?.replace(/\d+x\d+/, '2400x2400') ?? ''
  return splits.join('/')
}

export const resolve: ResolveFunction = async (url) => {
  const response = await fetch({ url })
  const document_ = new DOMParser().parseFromString(response, 'text/html')

  const url_ = getUrl(document_) || url
  const artists = getArtists(document_)
  const date = getDate(document_)
  const tracks = getTracks(document_)
  const coverArt = asArray(getCoverArt(document_))

  let title = getTitle(document_)
  let type = getReleaseType(tracks.length)
  if (title?.includes(' - EP')) {
    title = title.replace(' - EP', '')
    type = 'ep'
  } else if (title?.includes(' - Single')) {
    title = title.replace(' - Single', '')
    type = 'single'
  }

  return {
    url: url_,
    title,
    artists,
    date,
    type,
    format: 'digital file',
    attributes: ['downloadable', 'streaming'],
    tracks,
    coverArt,
  }
}
