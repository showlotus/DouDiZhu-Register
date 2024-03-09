/**
 * 合并两个对象，相同键名且值为 number 类型的属性，则将值累加后再合并
 * @param obj1
 * @param obj2
 */
export function mergeObjNumberValue(obj1: Record<string, number>, obj2: Record<string, number>) {
  const res = {} as any
  for (const key in obj1) {
    res[key] = key in obj2 ? obj1[key] + obj2[key] : obj1[key]
  }

  for (const key in obj2) {
    if (!(key in obj1)) {
      res[key] = obj2[key]
    }
  }

  return res
}
