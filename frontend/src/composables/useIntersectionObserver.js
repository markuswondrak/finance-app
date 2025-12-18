import { ref, onMounted, onUnmounted } from 'vue'

export function useIntersectionObserver(options = {}) {
  const targetRef = ref(null)
  const isIntersecting = ref(false)
  let observer = null

  onMounted(() => {
    if (!targetRef.value) return

    observer = new IntersectionObserver(([entry]) => {
      isIntersecting.value = entry.isIntersecting
      if (entry.isIntersecting && options.once) {
        observer.disconnect()
      }
    }, options)

    observer.observe(targetRef.value)
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return { targetRef, isIntersecting }
}
