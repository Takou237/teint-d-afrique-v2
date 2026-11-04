import { useCallback, useEffect, useState } from 'react'
import {
  apiErrorMessage,
  deleteContentBlock,
  discardContentDraft,
  fetchContent,
  fetchContentDrafts,
  publishContent,
  updateContent,
  type ContentBlock,
} from '@/admin/api'
import ImagePicker from '@/admin/components/ImagePicker'
import RichTextEditor from '@/admin/components/RichTextEditor'
import { Banner, Button, Field, TextArea, TextInput, useConfirm } from '@/admin/components/ui'
import { sanitizePreviewHtml } from '@/admin/lib/preview'
import fondatrice from '@/assets/fondatrice.webp'

/** Aide affichée sous certains blocs texte dont le rendu sur le site suit une convention. */
const BLOCK_HINTS: Record<string, string> = {
  'accueil.hero_title':
    "Chaque retour à la ligne crée une ligne du titre. Entourez un mot d'astérisques pour le mettre en doré, ex. *ÉCLAT*.",
}

/** Libellés lisibles des blocs image (sinon la clé technique est affichée). */
const IMAGE_LABELS: Record<string, string> = {
  'accueil.fondatrice_image': 'Portrait de la fondatrice',
  'histoire.image': "Image de l'histoire",
  'fondatrice.image': 'Portrait de la fondatrice',
  'vision.image': 'Image de la vision',
  'engagements.image': 'Image des engagements',
  'nos-produits.image': "Image d'introduction des produits",
  'types.image': 'Image des types de produits',
  'expertise.image': "Image de l'expertise",
  'localisation.image': 'Image de la localisation',
  'global.logo': 'Logo du site',
}

/** Images statiques de repli quand aucune image CMS n'est encore choisie. */
const FALLBACK_IMAGES: Record<string, string> = {
  'accueil.fondatrice_image': fondatrice,
  'fondatrice.image': fondatrice,
}

const PAGES: { id: string; label: string }[] = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'boutique', label: 'Boutique' },
  { id: 'histoire', label: 'Notre Histoire' },
  { id: 'fondatrice', label: 'Fondatrice' },
  { id: 'vision', label: 'Vision' },
  { id: 'engagements', label: 'Engagements' },
  { id: 'valeurs', label: 'Valeurs' },
  { id: 'nos-produits', label: 'Nos Produits' },
  { id: 'gamme', label: 'Page gamme' },
  { id: 'types', label: 'Types de produits' },
  { id: 'vos-besoins', label: 'Vos Besoins' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'vlogs', label: 'Vlogs' },
  { id: 'contact', label: 'Contact' },
  { id: 'localisation', label: 'Localisation' },
  { id: 'distributeurs', label: 'Distributeurs' },
  { id: 'produit', label: 'Fiche produit' },
  { id: 'global', label: 'Global' },
]

const BLOCK_TYPES = [
  { value: 'text', label: 'Texte court' },
  { value: 'richtext', label: 'Texte enrichi (HTML)' },
  { value: 'image', label: 'Image' },
] as const

type BlockType = (typeof BLOCK_TYPES)[number]['value']

export default function ContentPage({
  onDraftsCountChange,
}: {
  /** Prévient la navigation du nombre de brouillons en attente (badge de l'onglet Pages). */
  onDraftsCountChange?: (count: number) => void
} = {}) {
  const [page, setPage] = useState('accueil')
  // Contenu en ligne (page_content) et modifications en attente (content_drafts).
  const [blocks, setBlocks] = useState<ContentBlock[] | null>(null)
  const [drafts, setDrafts] = useState<ContentBlock[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [publishedCount, setPublishedCount] = useState<number | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [confirm, confirmModal] = useConfirm()

  const reload = useCallback(() => setReloadToken(token => token + 1), [])

  useEffect(() => {
    let cancelled = false
    setBlocks(null)
    setLoadError(null)
    setPublishedCount(null)
    setPublishError(null)
    Promise.all([fetchContent(page), fetchContentDrafts(page)])
      .then(([live, pending]) => {
        if (cancelled) return
        setBlocks(live)
        setDrafts(pending)
        onDraftsCountChange?.(pending.length)
      })
      .catch(() => {
        if (!cancelled) setLoadError('Impossible de charger le contenu de cette page.')
      })
    return () => {
      cancelled = true
    }
  }, [page, reloadToken, onDraftsCountChange])

  async function handlePublish() {
    const ok = await confirm({
      title: 'Publier les modifications ?',
      message: (
        <>
          Les <strong>{drafts.length}</strong> modification{drafts.length > 1 ? 's' : ''} en attente sur cette
          page seront mises en ligne immédiatement, visibles par tous les visiteurs.
        </>
      ),
      confirmLabel: 'Publier',
    })
    if (!ok) return
    setPublishing(true)
    setPublishError(null)
    setPublishedCount(null)
    try {
      const result = await publishContent(page)
      setPublishedCount(result.published)
      reload()
    } catch (err) {
      setPublishError(apiErrorMessage(err))
    } finally {
      setPublishing(false)
    }
  }

  const draftByKey = new Map(drafts.map(draft => [draft.blockKey, draft]))
  const liveByKey = new Map((blocks ?? []).map(block => [block.blockKey, block]))
  const blockKeys = [...new Set([...liveByKey.keys(), ...draftByKey.keys()])].sort()

  return (
    <div className="space-y-8">
      {confirmModal}
      {previewOpen && (
        <DraftPreviewModal page={page} drafts={drafts} onClose={() => setPreviewOpen(false)} />
      )}

      <div className="flex gap-2 flex-wrap">
        {PAGES.map(p => (
          <button
            key={p.id}
            onClick={() => setPage(p.id)}
            className={`px-4 py-2 text-[11px] tracking-[0.15em] uppercase border transition-colors ${
              page === p.id
                ? 'border-[#3B1705] bg-[#3B1705] text-[#FAF6EF]'
                : 'border-[#3B1705]/20 text-[#3B1705] hover:bg-[#3B1705]/5'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loadError && <Banner kind="error">{loadError}</Banner>}

      {!loadError && drafts.length > 0 && (
        <div className="bg-[#C97B1A]/10 border border-[#C97B1A]/40 px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm text-[#3B1705]">
              <strong>{drafts.length}</strong> modification{drafts.length > 1 ? 's' : ''} en attente de
              publication
            </p>
            <p className="text-[11px] text-[#3B1705]/50 mt-1">
              Le site public affiche encore la version en ligne de cette page.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
              Aperçu
            </Button>
            <Button onClick={handlePublish} disabled={publishing}>
              {publishing ? 'Publication...' : 'Publier'}
            </Button>
          </div>
        </div>
      )}

      {publishError && <Banner kind="error">{publishError}</Banner>}
      {publishedCount !== null && (
        <Banner kind="success">
          Page publiée : {publishedCount} bloc{publishedCount > 1 ? 's' : ''} mis à jour sur le site.
        </Banner>
      )}

      {!loadError && blocks === null && <p className="text-sm text-[#3B1705]/50">Chargement...</p>}
      {blocks !== null && blockKeys.length === 0 && (
        <p className="text-sm text-[#3B1705]/50">
          Aucun bloc de contenu pour cette page. Utilisez le formulaire ci-dessous pour en créer un.
        </p>
      )}

      {blocks !== null && blockKeys.length > 0 && (
        <div className="space-y-4">
          {blockKeys.map(key => (
            <BlockEditor
              key={key}
              page={page}
              live={liveByKey.get(key) ?? null}
              draft={draftByKey.get(key) ?? null}
              onChanged={reload}
            />
          ))}
        </div>
      )}

      <AddBlockForm page={page} onCreated={reload} />
    </div>
  )
}

/** Rendu approximatif d'un bloc tel qu'il apparaîtra sur le site. */
function BlockPreviewContent({
  type,
  valueFr,
  valueEn,
  imageFr,
  imageEn,
  fallbackImage,
}: {
  type: BlockType
  valueFr: string
  valueEn: string
  imageFr: string | null
  imageEn: string | null
  fallbackImage?: string
}) {
  const body = (value: string, image: string | null) => {
    if (type === 'image') {
      const src = image ?? fallbackImage ?? null
      return src ? (
        <img src={src} alt="" className="w-full h-40 object-cover" />
      ) : (
        <p className="text-xs text-[#3B1705]/40">Aucune image</p>
      )
    }
    if (type === 'richtext') {
      return (
        <div
          className="text-sm leading-relaxed text-[#2A1006]/85 [&_p]:mb-3 [&_strong]:font-semibold [&_em]:italic [&_ul]:list-disc [&_ul]:pl-5 [&_a]:underline [&_a]:text-[#C97B1A]"
          dangerouslySetInnerHTML={{ __html: sanitizePreviewHtml(value) }}
        />
      )
    }
    return <p className="text-sm leading-relaxed text-[#2A1006]/85 whitespace-pre-line">{value}</p>
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <span className="block text-[10px] tracking-[0.15em] uppercase text-[#3B1705]/40 mb-1">FR</span>
        {body(valueFr, imageFr)}
      </div>
      <div>
        <span className="block text-[10px] tracking-[0.15em] uppercase text-[#3B1705]/40 mb-1">EN</span>
        {body(valueEn, imageEn)}
      </div>
    </div>
  )
}

/** Modale listant les brouillons enregistrés d'une page, avant publication. */
function DraftPreviewModal({
  page,
  drafts,
  onClose,
}: {
  page: string
  drafts: ContentBlock[]
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-[#2A1006]/50 px-4 py-10 overflow-y-auto"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="draft-preview-title"
        className="w-full max-w-3xl bg-[#FAF6EF] border border-[#3B1705]/15 shadow-xl p-6 space-y-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="draft-preview-title"
              className="text-xl text-[#3B1705]"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Aperçu des modifications
            </h2>
            <p className="text-xs text-[#3B1705]/50 mt-1">
              Page « {PAGES.find(p => p.id === page)?.label ?? page} » — rien n'est encore en ligne.
            </p>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
        </div>

        <div className="space-y-4">
          {drafts.map(draft => {
            const key = `${page}.${draft.blockKey}`
            const label = IMAGE_LABELS[key] ?? draft.blockKey
            return (
              <div key={draft.blockKey} className="bg-white border border-[#3B1705]/10 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] tracking-[0.15em] uppercase text-[#3B1705]/60">{label}</p>
                  <span className="text-[9px] tracking-[0.15em] uppercase text-[#C97B1A]">Modifié</span>
                </div>
                <BlockPreviewContent
                  type={draft.blockType}
                  valueFr={draft.blockType === 'image' ? '' : draft.valueFr}
                  valueEn={draft.blockType === 'image' ? '' : draft.valueEn}
                  imageFr={draft.imageUrlFr}
                  imageEn={draft.imageUrlEn}
                  fallbackImage={FALLBACK_IMAGES[key]}
                />
              </div>
            )
          })}
        </div>

        <p className="text-[11px] text-[#3B1705]/45">
          L'aperçu montre le contenu et les images, pas la mise en page exacte du site. Une fois publié, le
          contenu apparaît tel quel dans les pages et les sections concernées.
        </p>
      </div>
    </div>
  )
}

function BlockEditor({
  page,
  live,
  draft,
  onChanged,
}: {
  page: string
  /** Contenu actuellement en ligne (null pour un bloc créé en brouillon seulement). */
  live: ContentBlock | null
  /** Modification en attente, si elle existe. */
  draft: ContentBlock | null
  onChanged: () => void
}) {
  // Le bloc affiché est le brouillon s'il existe, sinon le contenu publié.
  const current = draft ?? live
  const type: BlockType = current?.blockType ?? 'text'
  const draftType = draft?.blockType ?? null

  const initialFr = current ? (type === 'image' ? String(current.imageIdFr ?? '') : current.valueFr ?? '') : ''
  const initialEn = current ? (type === 'image' ? String(current.imageIdEn ?? '') : current.valueEn ?? '') : ''

  const [valueFr, setValueFr] = useState(initialFr)
  const [valueEn, setValueEn] = useState(initialEn)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  // Dernières valeurs enregistrées : sert à désactiver « Enregistrer » quand rien n'a changé.
  const [savedFr, setSavedFr] = useState(initialFr)
  const [savedEn, setSavedEn] = useState(initialEn)
  const [imageFr, setImageFr] = useState(current?.imageUrlFr ?? null)
  const [imageEn, setImageEn] = useState(current?.imageUrlEn ?? null)
  const [showPreview, setShowPreview] = useState(false)

  const hint = BLOCK_HINTS[`${page}.${current?.blockKey}`]
  const label = IMAGE_LABELS[`${page}.${current?.blockKey}`] ?? current?.blockKey ?? ''
  const fallback = FALLBACK_IMAGES[`${page}.${current?.blockKey}`]
  const [confirm, confirmModal] = useConfirm()
  const [deleting, setDeleting] = useState(false)
  const [discarding, setDiscarding] = useState(false)

  async function handleDelete() {
    const ok = await confirm({
      title: 'Supprimer ce bloc ?',
      message: (
        <>
          Le bloc <strong>« {label} »</strong> sera retiré de cette page, ainsi que son éventuel brouillon. Le
          site réaffichera alors le texte (ou l'image) d'origine à cet emplacement.{' '}
          <strong>Cette suppression est immédiate</strong>, elle ne passe pas par un brouillon.
        </>
      ),
      confirmLabel: 'Supprimer le bloc',
    })
    if (!ok) return
    setDeleting(true)
    setError(null)
    try {
      await deleteContentBlock(page, current?.blockKey ?? '')
      onChanged()
    } catch (err) {
      setError(apiErrorMessage(err))
      setDeleting(false)
    }
  }

  async function handleDiscard() {
    const ok = await confirm({
      title: 'Abandonner les modifications ?',
      message: (
        <>
          Le brouillon de <strong>« {label} »</strong> sera supprimé et le bloc réaffichera le contenu en ligne.
        </>
      ),
      confirmLabel: 'Abandonner',
    })
    if (!ok) return
    setDiscarding(true)
    setError(null)
    try {
      await discardContentDraft(page, current?.blockKey ?? '')
      // Retour aux valeurs publiées, sans attendre le rechargement.
      const publishedFr = live ? (live.blockType === 'image' ? String(live.imageIdFr ?? '') : live.valueFr ?? '') : ''
      const publishedEn = live ? (live.blockType === 'image' ? String(live.imageIdEn ?? '') : live.valueEn ?? '') : ''
      setValueFr(publishedFr)
      setValueEn(publishedEn)
      setSavedFr(publishedFr)
      setSavedEn(publishedEn)
      setImageFr(live?.imageUrlFr ?? null)
      setImageEn(live?.imageUrlEn ?? null)
      setSuccess(false)
      setShowPreview(false)
      onChanged()
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setDiscarding(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      await updateContent(page, current?.blockKey ?? '', valueFr, valueEn, type)
      setSavedFr(valueFr)
      setSavedEn(valueEn)
      setSuccess(true)
      onChanged()
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const draftFooter = (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#3B1705]/10 pt-3">
      <p className="text-[11px] text-[#3B1705]/40">
        Supprimer ce bloc rétablit le contenu d'origine du site à cet emplacement.
      </p>
      <Button variant="danger" disabled={deleting || saving || discarding} onClick={handleDelete}>
        {deleting ? 'Suppression...' : 'Supprimer le bloc'}
      </Button>
    </div>
  )

  const statusRow = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {draft ? (
          <span className="text-[9px] tracking-[0.15em] uppercase text-[#C97B1A] border border-[#C97B1A]/40 px-2 py-1">
            Brouillon non publié
          </span>
        ) : (
          <span className="text-[9px] tracking-[0.15em] uppercase text-[#3B1705]/35 border border-[#3B1705]/15 px-2 py-1">
            En ligne
          </span>
        )}
        {draft && draftType && live && draftType !== live.blockType && (
          <span className="text-[10px] text-[#3B1705]/45">
            type modifié : {live.blockType} → {draftType}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" className="!px-3 !py-1" onClick={() => setShowPreview(v => !v)}>
          {showPreview ? "Masquer l'aperçu" : 'Aperçu'}
        </Button>
        {draft && (
          <Button variant="secondary" className="!px-3 !py-1" disabled={discarding} onClick={handleDiscard}>
            {discarding ? '...' : 'Abandonner'}
          </Button>
        )}
      </div>
    </div>
  )

  const preview = showPreview && (
    <div className="border border-[#3B1705]/15 bg-[#FAF6EF] p-4 space-y-3">
      <p className="text-[10px] tracking-[0.2em] uppercase text-[#3B1705]/45">
        Aperçu — {savedFr === valueFr && savedEn === valueEn ? 'brouillon enregistré' : 'saisie non enregistrée'}
      </p>
      <BlockPreviewContent
        type={type}
        valueFr={valueFr}
        valueEn={valueEn}
        imageFr={imageFr}
        imageEn={imageEn}
        fallbackImage={fallback}
      />
    </div>
  )

  if (type === 'image') {
    return (
      <div className="bg-white border border-[#3B1705]/10 p-5 space-y-4">
        {confirmModal}
        {statusRow}
        <p className="text-[11px] tracking-[0.15em] uppercase text-[#3B1705]/60">{label}</p>
        <div className="grid md:grid-cols-2 gap-6">
          <ImagePicker
            label="Version française"
            currentImage={imageFr}
            fallbackImage={fallback}
            onPick={async media => {
              setSuccess(false)
              await updateContent(page, current?.blockKey ?? '', media ? String(media.id) : '', valueEn, 'image')
              setImageFr(media?.url ?? null)
              setValueFr(media ? String(media.id) : '')
              setSavedFr(media ? String(media.id) : '')
              setSuccess(true)
              onChanged()
            }}
          />
          <ImagePicker
            label="Version anglaise"
            currentImage={imageEn}
            fallbackImage={fallback}
            onPick={async media => {
              setSuccess(false)
              await updateContent(page, current?.blockKey ?? '', valueFr, media ? String(media.id) : '', 'image')
              setImageEn(media?.url ?? null)
              setValueEn(media ? String(media.id) : '')
              setSavedEn(media ? String(media.id) : '')
              setSuccess(true)
              onChanged()
            }}
          />
        </div>
        {preview}
        {error && <p className="text-xs text-red-700">{error}</p>}
        {success && <p className="text-xs text-emerald-700">Brouillon enregistré : publiez la page pour le mettre en ligne.</p>}
        {draftFooter}
      </div>
    )
  }

  const rows =
    type === 'richtext'
      ? 5
      : Math.max(2, Math.max(valueFr.split('\n').length, valueEn.split('\n').length))

  return (
    <div className="bg-white border border-[#3B1705]/10 p-5 space-y-3">
      {confirmModal}
      {statusRow}
      <Field label={`${current?.blockKey ?? ''} (${type})`}>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <span className="block text-[10px] tracking-[0.15em] uppercase text-[#3B1705]/40 mb-1">FR</span>
            {type === 'richtext' ? (
              <RichTextEditor
                value={valueFr}
                rows={rows}
                showHint={false}
                onChange={next => {
                  setValueFr(next)
                  setSuccess(false)
                }}
              />
            ) : (
              <TextArea
                rows={rows}
                value={valueFr}
                onChange={e => {
                  setValueFr(e.target.value)
                  setSuccess(false)
                }}
              />
            )}
          </div>
          <div>
            <span className="block text-[10px] tracking-[0.15em] uppercase text-[#3B1705]/40 mb-1">EN</span>
            {type === 'richtext' ? (
              <RichTextEditor
                value={valueEn}
                rows={rows}
                showHint={false}
                onChange={next => {
                  setValueEn(next)
                  setSuccess(false)
                }}
              />
            ) : (
              <TextArea
                rows={rows}
                value={valueEn}
                onChange={e => {
                  setValueEn(e.target.value)
                  setSuccess(false)
                }}
              />
            )}
          </div>
        </div>
      </Field>
      {hint && <p className="text-xs text-[#3B1705]/40">{hint}</p>}
      {type === 'richtext' && (
        <p className="text-xs text-[#3B1705]/40">
          Balises HTML autorisées : &lt;p&gt; &lt;strong&gt; &lt;em&gt; &lt;br&gt; &lt;ul&gt; &lt;li&gt; &lt;a&gt; — le
          reste est retiré automatiquement.
        </p>
      )}
      {preview}
      {error && <p className="text-xs text-red-700">{error}</p>}
      {success && (
        <p className="text-xs text-emerald-700">
          Brouillon enregistré : publiez la page pour le mettre en ligne.
        </p>
      )}
      <Button
        variant="secondary"
        onClick={handleSave}
        disabled={saving || (valueFr === savedFr && valueEn === savedEn)}
      >
        {saving ? 'Enregistrement...' : 'Enregistrer le brouillon'}
      </Button>
      {draftFooter}
    </div>
  )
}

function AddBlockForm({ page, onCreated }: { page: string; onCreated: () => void }) {
  const [blockKey, setBlockKey] = useState('')
  const [blockType, setBlockType] = useState<BlockType>('text')
  const [valueFr, setValueFr] = useState('')
  const [valueEn, setValueEn] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit() {
    const key = blockKey.trim()
    if (!/^[a-z0-9_-]{1,100}$/i.test(key)) {
      setError('La clé doit contenir uniquement des lettres, chiffres, tirets ou underscores.')
      return
    }
    if (blockType !== 'image' && !valueFr.trim() && !valueEn.trim()) {
      setError('Remplissez au moins une des deux versions.')
      return
    }
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      await updateContent(page, key, blockType === 'image' ? '' : valueFr, blockType === 'image' ? '' : valueEn, blockType)
      setBlockKey('')
      setValueFr('')
      setValueEn('')
      setSuccess(true)
      onCreated()
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="border border-dashed border-[#3B1705]/25 p-5 space-y-4 bg-[#FAF6EF]/60">
      <h3 className="text-sm tracking-[0.15em] uppercase text-[#3B1705]/60">Ajouter un bloc de contenu</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Clé du bloc">
          <TextInput
            value={blockKey}
            onChange={e => {
              setBlockKey(e.target.value)
              setError(null)
              setSuccess(false)
            }}
            placeholder="ex. histoire.intro"
            maxLength={100}
          />
        </Field>
        <Field label="Type">
          <select
            value={blockType}
            onChange={e => {
              setBlockType(e.target.value as BlockType)
              setError(null)
              setSuccess(false)
            }}
            className="w-full border border-[#3B1705]/20 px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#C97B1A]"
          >
            {BLOCK_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {blockType !== 'image' && (
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Texte FR">
            <TextArea rows={3} value={valueFr} onChange={e => setValueFr(e.target.value)} />
          </Field>
          <Field label="Texte EN">
            <TextArea rows={3} value={valueEn} onChange={e => setValueEn(e.target.value)} />
          </Field>
        </div>
      )}

      {error && <Banner kind="error">{error}</Banner>}
      {success && <Banner kind="success">Bloc ajouté en brouillon. Publiez la page pour le mettre en ligne.</Banner>}
      <Button variant="secondary" onClick={handleSubmit} disabled={saving || !blockKey.trim()}>
        {saving ? 'Création...' : '+ Créer le bloc'}
      </Button>
      <p className="text-[11px] text-[#3B1705]/40">
        Le bloc est enregistré en brouillon, comme les autres modifications. Si la clé existe déjà pour cette
        page, son brouillon est mis à jour au lieu d'être dupliqué.
      </p>
    </section>
  )
}
