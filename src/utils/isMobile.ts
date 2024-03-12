export const isMobile = () => {
  return (
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ||
    'ontouchstart' in document.documentElement
  )
}
