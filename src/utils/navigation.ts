export const preferredScrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

export function scrollToVisibleElement(selector: string) {
  const element = Array.from(document.querySelectorAll<HTMLElement>(selector)).find(
    (candidate) => candidate.getClientRects().length > 0,
  )
  if (!element) return
  const sidebar = element.closest<HTMLElement>('[data-sidebar-scroll]')
  if (sidebar) {
    sidebar.scrollTo({
      top:
        sidebar.scrollTop +
        element.getBoundingClientRect().top -
        sidebar.getBoundingClientRect().top,
      behavior: preferredScrollBehavior(),
    })
  } else {
    window.scrollTo({
      top: Math.max(
        0,
        window.scrollY + element.getBoundingClientRect().top - (window.innerWidth < 768 ? 20 : 85),
      ),
      behavior: preferredScrollBehavior(),
    })
  }
}
