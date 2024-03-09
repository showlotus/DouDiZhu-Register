const SEQUENCE = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

function generateSequence(str: string, nums: number) {
  const [start, end] = str.split('-')
  const startIdx = SEQUENCE.indexOf(start)
  const endIdx = SEQUENCE.lastIndexOf(end)
  const res = {} as any
  for (let i = startIdx; i <= endIdx; i++) {
    const key = SEQUENCE[i]
    res[key] = nums
  }
  return res
}

export const parser = {
  single: {
    validate(str: string) {
      return /^([2-9]|10|J|Q|K|A|<|>|<>|><)$/i.test(str)
    },
    generate(str: string) {
      if (str === '<') {
        return {
          joker: 1,
        }
      } else if (str === '>') {
        return {
          JOKER: 1,
        }
      } else if (str === '<>' || str === '><') {
        return {
          JOKER: 1,
          joker: 1,
        }
      } else {
        return {
          [str]: 1,
        }
      }
    },
  },
  double: {
    validate(str: string) {
      return /^D([2-9]|10|J|Q|K|A)$/i.test(str)
    },
    generate(str: string) {
      return {
        [str.slice(1)]: 2,
      }
    },
  },
  sequence: {
    validate(str: string) {
      return /^([3-9]|10|J|Q|K|A)-([3-9]|10|J|Q|K|A)$/i.test(str)
    },
    generate(str: string) {
      return generateSequence(str, 1)
    },
  },
  doubleSequence: {
    validate(str: string) {
      return /^D([3-9]|10|J|Q|K|A)-D([3-9]|10|J|Q|K|A)$/i.test(str)
    },
    generate(str: string) {
      str = str.replace(/D/g, '')
      return generateSequence(str, 2)
    },
  },
  triplet: {
    validate(str: string) {
      return /^T([2-9]|10|J|Q|K|A)$/i.test(str)
    },
    generate(str: string) {
      return {
        [str.slice(1)]: 3,
      }
    },
  },
  tripletSequence: {
    validate(str: string) {
      return /^T([3-9]|10|J|Q|K|A)-T([3-9]|10|J|Q|K|A)$/i.test(str)
    },
    generate(str: string) {
      str = str.replace(/T/g, '')
      return generateSequence(str, 3)
    },
  },
  quadriplet: {
    validate(str: string) {
      return /^F([2-9]|10|J|Q|K|A)$/i.test(str)
    },
    generate(str: string) {
      return {
        [str.slice(1)]: 4,
      }
    },
  },
}
