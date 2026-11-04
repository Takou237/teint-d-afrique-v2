/**
 * Nettoyage du HTML affiché dans l'aperçu des blocs de texte enrichi.
 *
 * La saisie en cours n'a pas encore été envoyée au serveur (donc pas encore passée par
 * `sanitize_richtext`) : on applique ici la même liste blanche avant de l'afficher,
 * pour qu'un copier-coller malheureux ne puisse pas exécuter de code dans le panneau.
 */

const ALLOWED_TAGS = new Set(['P', 'STRONG', 'EM', 'BR', 'UL', 'LI', 'A'])

export function sanitizePreviewHtml(html: string): string {
  if (typeof DOMParser === 'undefined') return ''

  const doc = new DOMParser().parseFromString(`<div id="preview-root">${html}</div>`, 'text/html')
  const root = doc.getElementById('preview-root')
  if (!root) return ''

  root.querySelectorAll('script,style,iframe,object,embed').forEach(node => node.remove())

  for (const element of Array.from(root.querySelectorAll('*'))) {
    if (!ALLOWED_TAGS.has(element.tagName)) {
      // Balise non autorisée : on garde son contenu, on retire la balise.
      const parent = element.parentNode
      if (!parent) continue
      while (element.firstChild) parent.insertBefore(element.firstChild, element)
      parent.removeChild(element)
      continue
    }

    const href = element.tagName === 'A' ? element.getAttribute('href') ?? '' : ''
    for (const attribute of Array.from(element.attributes)) {
      element.removeAttribute(attribute.name)
    }

    if (element.tagName === 'A' && /^(https?:\/\/|mailto:)/i.test(href)) {
      element.setAttribute('href', href)
      element.setAttribute('target', '_blank')
      element.setAttribute('rel', 'noopener noreferrer')
    }
  }

  return root.innerHTML
}
