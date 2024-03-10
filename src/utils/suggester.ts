import Store, { CardType, StoreData } from '../modules/Store'
import { sequence } from './config'
import { parser } from './parser'

function getKeyIndex(key: CardType) {
  return sequence.indexOf(key)
}

function findRemainNumsMaxThan(nums: number, start: number, data: StoreData) {
  const cards = sequence.concat('2')
  for (let i = 0; i < cards.length; i++) {
    const key = cards[(i + start) % cards.length]
    if (data.get(key)! >= nums) {
      return key
    }
  }
  return ''
}

function findSequencesLenMaxThan(len: number, start: CardType, nums: number, data: StoreData) {
  const startIdx = getKeyIndex(start)
  let endIdx = startIdx
  for (let i = startIdx; i < sequence.length; i++) {
    const key = sequence[i]
    if (endIdx - startIdx + 1 >= len || data.get(key)! < nums) {
      break
    }

    endIdx = i
  }

  if (endIdx - startIdx + 1 >= len) {
    return sequence[endIdx]
  }

  return ''
}

function suggestDouble(latestCommand: string | undefined) {
  if (latestCommand && parser.double.validate(latestCommand)) {
    const idx = getKeyIndex(latestCommand.slice(1) as CardType)
    return idx + 1
  }
  return null
}

function suggestTriplet(latestCommand: string | undefined) {
  if (latestCommand && parser.triplet.validate(latestCommand)) {
    const idx = getKeyIndex(latestCommand.slice(1) as CardType)
    return idx + 1
  }
  return null
}

function suggestQuadriplet(latestCommand: string | undefined) {
  if (latestCommand && parser.quadriplet.validate(latestCommand)) {
    const idx = getKeyIndex(latestCommand.slice(1) as CardType)
    return idx + 1
  }
  return null
}

function suggestSequenceLen(latestCommand: string | undefined) {
  if (latestCommand && parser.sequence.validate(latestCommand)) {
    const [startIdx, endIdx] = (latestCommand.split('-') as CardType[]).map(v => getKeyIndex(v))
    return endIdx - startIdx + 1
  }
  return null
}

function suggestDoubleSequenceLen(latestCommand: string | undefined) {
  if (latestCommand && parser.doubleSequence.validate(latestCommand)) {
    const [startIdx, endIdx] = (latestCommand.replace(/D/g, '').split('-') as CardType[]).map(v =>
      getKeyIndex(v),
    )
    return endIdx - startIdx + 1
  }
  return null
}

function suggestTripletSequenceLen(latestCommand: string | undefined) {
  if (latestCommand && parser.tripletSequence.validate(latestCommand)) {
    const [startIdx, endIdx] = (latestCommand.replace(/T/g, '').split('-') as CardType[]).map(v =>
      getKeyIndex(v),
    )
    return endIdx - startIdx + 1
  }
  return null
}

const REGEXP_D = /(^|,)D$/
const REGEXP_S = /(^|,)([3-9]|10|J|Q|K|A)-$/
const REGEXP_DS = /(^|,)D([3-9]|10|J|Q|K|A)-$/
const REGEXP_T = /(^|,)T$/
const REGEXP_TS = /(^|,)T([3-9]|10|J|Q|K|A)-$/
const REGEXP_F = /(^|,)F$/

export function suggester(token: string, store: Store) {
  const data = store.getData()
  const latestCommand = store.getLastestRecord()?.[1]

  if (REGEXP_D.test(token)) {
    const start = suggestDouble(latestCommand) || 0
    return token + findRemainNumsMaxThan(2, start, data)
  } else if (REGEXP_S.test(token)) {
    const key = token.match(REGEXP_S)![2] as CardType
    const len = suggestSequenceLen(latestCommand) || 5
    return token + findSequencesLenMaxThan(len, key, 1, data)
  } else if (REGEXP_DS.test(token)) {
    const key = token.match(REGEXP_DS)![2] as CardType
    const len = suggestDoubleSequenceLen(latestCommand) || 3
    const text = findSequencesLenMaxThan(len, key, 2, data)
    if (text) {
      return token + 'D' + text
    }
  } else if (REGEXP_T.test(token)) {
    const start = suggestTriplet(latestCommand) || 0
    return token + findRemainNumsMaxThan(3, start, data)
  } else if (REGEXP_TS.test(token)) {
    const key = token.match(REGEXP_TS)![2] as CardType
    const len = suggestTripletSequenceLen(latestCommand) || 2
    const text = findSequencesLenMaxThan(len, key, 3, data)
    if (text) {
      return token + 'T' + text
    }
  } else if (REGEXP_F.test(token)) {
    const start = suggestQuadriplet(latestCommand) || 0
    return token + findRemainNumsMaxThan(4, start, data)
  }

  return ''
}
