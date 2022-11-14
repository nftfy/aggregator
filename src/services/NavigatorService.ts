export const readText = () => {
  return navigator?.clipboard?.readText()
}

export const writeText = (text: string) => {
  return navigator?.clipboard?.writeText(text)
}
