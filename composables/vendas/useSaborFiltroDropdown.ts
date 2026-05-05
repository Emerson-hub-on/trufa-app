export function useSaborFiltroDropdown() {
  const saborFiltro = ref<string | null>(null)
  const dropdownOpen = ref(false)
  const dropdownRef = ref<HTMLElement | null>(null)

  onMounted(() => {
    document.addEventListener('click', (e) => {
      if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
        dropdownOpen.value = false
      }
    })
  })

  return { saborFiltro, dropdownOpen, dropdownRef }
}