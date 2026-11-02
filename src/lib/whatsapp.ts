import type { Lang } from '@/i18n'

export const WHATSAPP_NUMBER = '237000000000'

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function orderUrl(
  lang: Lang,
  product: { type: string; poids: string },
  gamme: { nom: string; ingredients: string }
) {
  const message =
    lang === 'en'
      ? `Hello Teint d'Afrique Cosmétiques, I would like to order the ${product.type} (${product.poids}) from the ${gamme.nom} range — ${gamme.ingredients}. Could you tell me about availability and how to order? Thank you.`
      : `Bonjour Teint d'Afrique Cosmétiques, je souhaite commander le ${product.type} (${product.poids}) de la gamme ${gamme.nom} — ${gamme.ingredients}. Pouvez-vous m'indiquer la disponibilité et les modalités de commande ? Merci.`
  return whatsappUrl(message)
}

export function generalUrl(lang: Lang) {
  return whatsappUrl(
    lang === 'en'
      ? "Hello Teint d'Afrique Cosmétiques, I would like information about your products."
      : "Bonjour Teint d'Afrique Cosmétiques, je souhaite avoir des informations sur vos produits."
  )
}

export function rangeUrl(
  lang: Lang,
  gamme: { nom: string; ingredients: string }
) {
  return whatsappUrl(
    lang === 'en'
      ? `Hello Teint d'Afrique Cosmétiques, I would like to know more about the ${gamme.nom} range — ${gamme.ingredients}. Could you guide me through the four products? Thank you.`
      : `Bonjour Teint d'Afrique Cosmétiques, je souhaite en savoir plus sur la gamme ${gamme.nom} — ${gamme.ingredients}. Pouvez-vous me guider parmi les quatre soins ? Merci.`
  )
}

