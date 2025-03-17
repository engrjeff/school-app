export const k12Ranking = [
  { max: 100, min: 98, remark: "🎖️🎖️🎖️ With Highest Honors" },
  { max: 97.99, min: 95, remark: "🎖️🎖️ With High Honors" },
  { max: 94.99, min: 90, remark: "🎖️ With Honors" },
  { max: 89.99, min: 75, remark: "🎉 Passed" },
  { max: 74.99, min: 0, remark: "❌ Failed" },
]

export function getRemark(average: number) {
  return k12Ranking.find((r) => average >= r.min && average <= r.max)?.remark
}
