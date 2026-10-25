// A center-out dot wave, like the original loader, using CSS instead of a canvas
// render loop or resize listener. Fixed-size dots stay crisp at mobile widths.
const columns = 36
const rows = 7
const delays = Array.from({ length: columns * rows }, (_, index) => {
  const x = Math.abs((index % columns) - (columns - 1) / 2)
  const y = Math.abs(Math.floor(index / columns) - (rows - 1) / 2)
  return `${((x * 0.75 + y * 0.5) / 14.625) * 0.65 - 0.65}s`
})

export default function SearchDotWave() {
  return (
    <div className="search-dot-wave" aria-hidden="true">
      {delays.map((animationDelay, index) => (
        <span key={index} style={{ animationDelay }} />
      ))}
    </div>
  )
}
