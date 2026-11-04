import type { Lang } from '@/i18n'

/** Numéro de secours : remplacé au chargement par la valeur du panneau d'admin. */
const FALLBACK_NUMBER = '237000000000'
let currentNumber = FALLBACK_NUMBER

export function setWhatsAppNumber(value: string | null | undefined) {
  const digits = (value ?? '').replace(/\D/g, '')
  currentNumber = digits || FALLBACK_NUMBER
}

export function getWhatsAppNumber(): string {
  return currentNumber
}

export function whatsappUrl(message: string, number: string = currentNumber) {
  return `https://wa.me/${(number || FALLBACK_NUMBER).replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}

export function orderUrl(
  lang: Lang,
  product: { type: string; poids: string },
  gamme: { nom: string; ingredients: string },
  number?: string
) {
  const message =
    lang === 'en'
      ? `Hello Teint d'Afrique Cosmétiques, I would like to order the ${product.type} (${product.poids}) from the ${gamme.nom} range — ${gamme.ingredients}. Could you tell me about availability and how to order? Thank you.`
      : `Bonjour Teint d'Afrique Cosmétiques, je souhaite commander le ${product.type} (${product.poids}) de la gamme ${gamme.nom} — ${gamme.ingredients}. Pouvez-vous m'indiquer la disponibilité et les modalités de commande ? Merci.`
  return whatsappUrl(message, number)
}

export function generalUrl(lang: Lang, number?: string) {
  return whatsappUrl(
    lang === 'en'
      ? "Hello Teint d'Afrique Cosmétiques, I would like information about your products."
      : "Bonjour Teint d'Afrique Cosmétiques, je souhaite avoir des informations sur vos produits.",
    number
  )
}

export function rangeUrl(lang: Lang, gamme: { nom: string; ingredients: string }, number?: string) {
  return whatsappUrl(
    lang === 'en'
      ? `Hello Teint d'Afrique Cosmétiques, I would like to know more about the ${gamme.nom} range — ${gamme.ingredients}. Could you guide me through the four products? Thank you.`
      : `Bonjour Teint d'Afrique Cosmétiques, je souhaite en savoir plus sur la gamme ${gamme.nom} — ${gamme.ingredients}. Pouvez-vous me guider parmi les quatre soins ? Merci.`,
    number
  )
}
