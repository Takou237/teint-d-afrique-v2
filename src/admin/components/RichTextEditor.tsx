import { useRef } from 'react'
import { TextArea } from './ui'

/**
 * Éditeur des blocs "texte enrichi" : une zone de texte avec une petite barre d'outils
 * qui insère les balises autorisées par l'API (<p> <strong> <em> <br> <ul> <li> <a>).
 * Pas de dépendance externe : les boutons manipulent la sélection du <textarea>.
 */
export default function RichTextEditor({
  value,
  onChange,
  rows = 5,
  placeholder,
  label,
  showHint = true,
}: {
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  label?: string
  showHint?: boolean
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  /** Remplace la sélection par $before + sélection + $after, puis la resélectionne. */
  function wrapSelection(before: string, after: string) {
    const el = ref.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end)
    const next = value.slice(0, start) + before + selected + after + value.slice(end)
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + before.length, start + before.length + selected.length)
    })
  }

  /** Ajoute un préfixe en début de chaque ligne sélectionnée (listes à puces). */
  function prefixLines(prefix: string) {
    const el = ref.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const block = value.slice(start, end)
    const lines = (block === '' ? 'Élément' : block).split('\n')
    const next = lines.map(line => prefix + line).join('\n')
    onChange(value.slice(0, start) + next + value.slice(end))
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start, start + next.length)
    })
  }

  function insertLink() {
    const el = ref.current
    if (!el) return
    const url = window.prompt('Adresse du lien (https://…)', 'https://')
    if (!url || !/^(https?:\/\/|mailto:)/i.test(url)) return
    const start = el.selectionStart
    const end = el.selectionEnd
    if (value.slice(start, end).trim() === '') {
      // Rien de sélectionné : on insère un lien complet avec un texte à remplacer.
      const link = '<a href="' + url + '">texte du lien</a>'
      onChange(value.slice(0, start) + link + value.slice(end))
      requestAnimationFrame(() => {
        el.focus()
        el.setSelectionRange(start + link.indexOf('>') + 1, start + link.lastIndexOf('</a>'))
      })
      return
    }
    wrapSelection('<a href="' + url + '">', '</a>')
  }

  function wrapList() {
    const el = ref.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end)
    if (selected.trim() === '') {
      wrapSelection('<ul>\n<li></li>\n</ul>', '')
      return
    }
    const items = selected
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => '<li>' + line + '</li>')
      .join('\n')
    const next = '<ul>\n' + items + '\n</ul>'
    onChange(value.slice(0, start) + next + value.slice(end))
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + next.length, start + next.length)
    })
  }

  const tools = [
    { label: 'G', title: 'Gras', className: 'font-bold', action: () => wrapSelection('<strong>', '</strong>') },
    { label: 'I', title: 'Italique', className: 'italic', action: () => wrapSelection('<em>', '</em>') },
    { label: 'P', title: 'Paragraphe', className: '', action: () => wrapSelection('<p>', '</p>') },
    { label: '• Liste', title: 'Liste à puces', className: '', action: wrapList },
    { label: 'Lien', title: 'Insérer un lien', className: '', action: insertLink },
    { label: 'Saut', title: 'Saut de ligne', className: '', action: () => wrapSelection('<br>', '') },
  ]

  return (
    <div className="space-y-1.5">
      {label && (
        <span className="block text-[10px] tracking-[0.15em] uppercase text-[#3B1705]/40">{label}</span>
      )}
      <div className="flex flex-wrap gap-1 border border-[#3B1705]/20 border-b-0 bg-[#FAF6EF] px-1.5 py-1">
        {tools.map(tool => (
          <button
            key={tool.title}
            type="button"
            title={tool.title}
            aria-label={tool.title}
            onMouseDown={e => {
              // Empêche le textarea de perdre sa sélection avant l'insertion.
              e.preventDefault()
              tool.action()
            }}
            className={`px-2 py-1 text-[11px] text-[#3B1705]/70 hover:bg-[#3B1705]/10 transition-colors ${tool.className}`}
          >
            {tool.label}
          </button>
        ))}
      </div>
      <TextArea
        ref={ref}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="!border-t-0"
      />
      {showHint && (
        <p className="text-[10px] text-[#3B1705]/40">
          Astuce : sélectionnez du texte puis cliquez sur un bouton. Balises autorisées : p, strong, em, br, ul,
          li, a.
        </p>
      )}
    </div>
  )
}
