export const randomPercentage = (percentage: number) => {
  return Math.random() < percentage
}

export interface pmfObject<T> {
  value: T
  frequency: number
}

export interface ExtendedPmfObject<T> extends pmfObject<T> {
  accumulate: number
  percentage: number
  frequencySum: number
}

export function pmfChoice<T>(pmfObjects: pmfObject<T>[]): pmfObject<T> {
  const extPmfObjects = pmfAnalyze(pmfObjects)
  const random = Math.random() * extPmfObjects[0].frequencySum
  for (const obj of extPmfObjects) {
    if (random <= obj.accumulate) return obj
  }
  return extPmfObjects[0]
}

export function recordToPmfObject<T extends string | number | symbol>(
  record: Record<T, number>
): pmfObject<T>[] {
  return Object.entries(record).map(([value, frequency]) => ({
    value: value as T,
    frequency,
  })) as pmfObject<T>[]
}

export function pmfAnalyze<T>(
  pmfObjects: pmfObject<T>[]
): ExtendedPmfObject<T>[] {
  let frequencySum = 0
  for (const obj of pmfObjects) {
    frequencySum += obj.frequency
    ;(obj as ExtendedPmfObject<T>).accumulate = frequencySum
  }

  for (const obj of pmfObjects) {
    ;(obj as ExtendedPmfObject<T>).frequencySum = frequencySum
    ;(obj as ExtendedPmfObject<T>).percentage = obj.frequency / frequencySum
  }
  return pmfObjects as ExtendedPmfObject<T>[]
}
