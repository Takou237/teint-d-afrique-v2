import { useEffect, useRef, useState } from 'react'
import {
  apiErrorMessage,
  createGamme,
  createProduit,
  deleteGamme,
  deleteProduit,
  fetchGammes,
  updateGamme,
  updateProduit,
  reorderProduits,
  reorderGammes,
  type Gamme,
  type Localized,
  type Product,
  type ProductDetails,
} from '@/admin/api'
import ImagePicker from '@/admin/components/ImagePicker'
import { Banner, Button, ColorInput, Field, LocalizedField, TextArea, TextInput, useConfirm } from '@/admin/components/ui'
import { getGammes } from '@/data'

type OrdreParGamme = Record<string, number[]>

type GammeForm = {
  nom: Localized
  tagline: Localized
  ingredients: Localized
  description: Localized
  ingredientsDetail: Localized
  heroLead: Localized
  heroAccent: Localized
  heroCopy: Localized
  heroAlt: Localized
  color: string
  colorLight: string
  colorDark: string
}

type ProduitForm = {
  type: Localized
  poids: string
  symbol: string
  description: Localized
  details: ProductDetails | null
}

function localized(fr: string): Localized {
  return { fr, en: fr }
}

function toForm(g: Gamme): GammeForm {
  return {
    nom: g.nom,
    tagline: g.tagline,
    ingredients: g.ingredients,
    description: g.description,
    ingredientsDetail: g.ingredientsDetail,
    heroLead: g.heroLead,
    heroAccent: g.heroAccent,
    heroCopy: g.heroCopy,
    heroAlt: g.heroAlt,
    color: g.color,
    colorLight: g.colorLight,
    colorDark: g.colorDark,
  }
}

function staticGamme(id: string) {
  return getGammes('fr').find(g => g.id === id)
}

function emptyDetails(nom: Localized): ProductDetails {
  return {
    nom,
    promesses: { fr: [], en: [] },
    actifs: { fr: '', en: '' },
    proprietes: { fr: '', en: '' },
    ingredients: { fr: '', en: '' },
    modeEmploi: { fr: '', en: '' },
    precautions: { fr: '', en: '' },
  }
}

export default function GammesPage() {
  const [gammes, setGammes] = useState<Gamme[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [ordre, setOrdre] = useState<OrdreParGamme>({})
  const [dragGammeId, setDragGammeId] = useState<string | null>(null)
  const [overGammeId, setOverGammeId] = useState<string | null>(null)
  const [tabsError, setTabsError] = useState<string | null>(null)
  const [newNomFr, setNewNomFr] = useState('')
  const [newNomEn, setNewNomEn] = useState('')
  const [creating, setCreating] = useState(false)

  function handleGammeDrop(targetId: string) {
    const source = dragGammeId
    setDragGammeId(null)
    setOverGammeId(null)
    if (!source || source === targetId) return
    const previous = gammes
    const from = previous.findIndex(g => g.id === source)
    const to = previous.findIndex(g => g.id === targetId)
    if (from < 0 || to < 0) return
    const next = [...previous]
    next.splice(from, 1)
    next.splice(to, 0, previous[from])
    setGammes(next)
    setTabsError(null)
    reorderGammes(next.map(g => g.id)).catch(err => {
      setGammes(previous)
      setTabsError(`Impossible de réordonner les gammes. ${apiErrorMessage(err)}`)
    })
  }

  async function handleCreateGamme() {
    const nom = { fr: newNomFr.trim(), en: newNomEn.trim() }
    if (!nom.fr || !nom.en) return
    setCreating(true)
    setTabsError(null)
    try {
      const gamme = await createGamme(nom)
      setGammes(prev => [...prev, gamme])
      setSelectedId(gamme.id)
      setNewNomFr('')
      setNewNomEn('')
    } catch (err) {
      setTabsError(`Impossible de créer la gamme. ${apiErrorMessage(err)}`)
    } finally {
      setCreating(false)
    }
  }

  function handleGammeUpdated(updated: Gamme) {
    setGammes(prev => prev.map(g => (g.id === updated.id ? updated : g)))
  }

  function handleGammeDeleted(id: string) {
    const remaining = gammes.filter(g => g.id !== id)
    setGammes(remaining)
    setSelectedId(remaining[0]?.id ?? null)
    setOrdre(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  useEffect(() => {
    setOrdre(prev => {
      const next: OrdreParGamme = { ...prev }
      for (const g of gammes) {
        const connus = new Set(next[g.id] ?? [])
        const ids = g.products.map(p => p.id)
        if (next[g.id] === undefined || ids.some(id => !connus.has(id))) {
          next[g.id] = ids
        }
      }
      return next
    })
  }, [gammes])

  useEffect(() => {
    fetchGammes()
      .then(data => {
        setGammes(data)
        setSelectedId(data[0]?.id ?? null)
      })
      .catch(() => setLoadError('Impossible de charger les gammes.'))
      .finally(() => setLoading(false))
  }, [])

  function handleProduitUpdated(gammeId: string, produit: Product) {
    setGammes(prev =>
      prev.map(g =>
        g.id !== gammeId ? g : { ...g, products: g.products.map(p => (p.id === produit.id ? produit : p)) }
      )
    )
  }

  function handleProduitAdded(gammeId: string, produit: Product) {
    setGammes(prev =>
      prev.map(g => (g.id === gammeId ? { ...g, products: [...g.products, produit] } : g))
    )
    setOrdre(prev => ({ ...prev, [gammeId]: [...(prev[gammeId] ?? []), produit.id] }))
  }

  function handleProduitRemoved(gammeId: string, produitId: number) {
    setGammes(prev =>
      prev.map(g =>
        g.id === gammeId ? { ...g, products: g.products.filter(p => p.id !== produitId) } : g
      )
    )
    setOrdre(prev => ({ ...prev, [gammeId]: (prev[gammeId] ?? []).filter(id => id !== produitId) }))
  }

  if (loading) return <p className="text-sm text-[#3B1705]/50">Chargement des gammes...</p>
  if (loadError) return <Banner kind="error">{loadError}</Banner>

  const selected = gammes.find(g => g.id === selectedId) ?? null

  return (
    <div className="space-y-8">
      <div className="flex gap-2 flex-wrap">
        {gammes.map(g => {
          const label = g.nom.fr || g.nom.en || g.id
          return (
            <button
              key={g.id}
              draggable
              onDragStart={e => {
                e.dataTransfer.effectAllowed = 'move'
                e.dataTransfer.setData('text/plain', g.id)
                setDragGammeId(g.id)
              }}
              onDragEnd={() => {
                setDragGammeId(null)
                setOverGammeId(null)
              }}
              onDragOver={e => {
                e.preventDefault()
                setOverGammeId(g.id)
              }}
              onDrop={e => {
                e.preventDefault()
                handleGammeDrop(g.id)
              }}
              onClick={() => setSelectedId(g.id)}
              title="Glisser pour réordonner les gammes"
              className={`flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.15em] uppercase border transition-colors ${
                selectedId === g.id
                  ? 'border-[#3B1705] bg-[#3B1705] text-[#FAF6EF]'
                  : 'border-[#3B1705]/20 text-[#3B1705] hover:bg-[#3B1705]/5'
              } ${dragGammeId === g.id ? 'opacity-40' : ''} ${
                dragGammeId && overGammeId === g.id && dragGammeId !== g.id ? 'ring-2 ring-[#C97B1A]' : ''
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: g.color }} />
              {label}
            </button>
          )
        })}
      </div>
      <p className="text-[11px] text-[#3B1705]/35 -mt-4">
        Astuce : glissez-déposez les onglets pour changer l'ordre des gammes sur le site.
      </p>

      <form
        className="flex flex-wrap gap-2 items-center -mt-2"
        onSubmit={e => {
          e.preventDefault()
          handleCreateGamme()
        }}
      >
        <div className="w-52">
          <TextInput
            value={newNomFr}
            onChange={e => setNewNomFr(e.target.value)}
            placeholder="Nom (FR)"
            maxLength={100}
          />
        </div>
        <div className="w-52">
          <TextInput
            value={newNomEn}
            onChange={e => setNewNomEn(e.target.value)}
            placeholder="Name (EN)"
            maxLength={100}
          />
        </div>
        <Button type="submit" variant="secondary" disabled={creating || !newNomFr.trim() || !newNomEn.trim()}>
          {creating ? 'Création...' : '+ Nouvelle gamme'}
        </Button>
      </form>

      {tabsError && <Banner kind="error">{tabsError}</Banner>}

      {selected && (
        <GammeEditor
          key={selected.id}
          gamme={selected}
          onGammeUpdated={handleGammeUpdated}
          onGammeDeleted={() => handleGammeDeleted(selected.id)}
          canDelete={gammes.length > 1}
          onProduitUpdated={produit => handleProduitUpdated(selected.id, produit)}
          onProduitAdded={produit => handleProduitAdded(selected.id, produit)}
          onProduitRemoved={produitId => handleProduitRemoved(selected.id, produitId)}
          ordre={ordre[selected.id] ?? selected.products.map(p => p.id)}
          onOrdreChanged={ids => setOrdre(prev => ({ ...prev, [selected.id]: ids }))}
        />
      )}
    </div>
  )
}

function GammeEditor({
  gamme,
  onGammeUpdated,
  onGammeDeleted,
  canDelete,
  onProduitUpdated,
  onProduitAdded,
  onProduitRemoved,
  ordre,
  onOrdreChanged,
}: {
  gamme: Gamme
  onGammeUpdated: (gamme: Gamme) => void
  onGammeDeleted: () => void
  canDelete: boolean
  onProduitUpdated: (produit: Product) => void
  onProduitAdded: (produit: Product) => void
  onProduitRemoved: (produitId: number) => void
  ordre: number[]
  onOrdreChanged: (ids: number[]) => void
}) {
  const [form, setForm] = useState<GammeForm>(toForm(gamme))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirm, confirmModal] = useConfirm()
  const [productsError, setProductsError] = useState<string | null>(null)
  const [dragId, setDragId] = useState<number | null>(null)
  const [overId, setOverId] = useState<number | null>(null)

  const statique = staticGamme(gamme.id)
  const fallbackImage = statique?.mainImage

  const produitsOrdonnes = ordre
    .map(id => gamme.products.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined)

  function reordonner(ids: number[]) {
    onOrdreChanged(ids)
    setProductsError(null)
    reorderProduits(gamme.id, ids).catch(err => {
      onOrdreChanged(ordre)
      setProductsError(apiErrorMessage(err))
    })
  }

  function handleDrop(targetId: number) {
    const source = dragId
    setDragId(null)
    setOverId(null)
    if (source === null || source === targetId) return
    const ids = [...ordre]
    const from = ids.indexOf(source)
    const to = ids.indexOf(targetId)
    if (from < 0 || to < 0) return
    ids.splice(from, 1)
    ids.splice(to, 0, source)
    reordonner(ids)
  }

  function set<K extends keyof GammeForm>(key: K, value: GammeForm[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    setSuccess(false)
  }

  async function handleSave() {
    const couleurs = [
      ['Couleur', form.color],
      ['Couleur claire', form.colorLight],
      ['Couleur foncée', form.colorDark],
    ] as const
    const invalide = couleurs.find(([, v]) => !/^#[0-9A-Fa-f]{6}$/.test(v))
    if (invalide) {
      setSuccess(false)
      setError(`« ${invalide[0]} » doit être au format #RRGGBB (ex. #C97B1A).`)
      return
    }
    if (!form.nom.fr.trim() || !form.nom.en.trim()) {
      setSuccess(false)
      setError('Le nom de la gamme est requis en français et en anglais.')
      return
    }

    setSaving(true)
    setError(null)
    try {
      const updated = await updateGamme(gamme.id, form)
      onGammeUpdated(updated)
      setSuccess(true)
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function pickImage(field: 'imageId' | 'mainImageId' | 'heroImageId' | 'heroImageSmallId', mediaId: number | null) {
    const updated = await updateGamme(gamme.id, { [field]: mediaId })
    onGammeUpdated(updated)
  }

  async function handleDeleteGamme() {
    const n = gamme.products.length
    const ok = await confirm({
      title: 'Supprimer la gamme ?',
      message: (
        <>
          La gamme <strong>« {gamme.nom.fr} »</strong>
          {n > 0 && <> et ses <strong>{n} produit{n > 1 ? 's' : ''}</strong></>} seront supprimés du site.
          Cette action est définitive.
        </>
      ),
      confirmLabel: 'Supprimer la gamme',
    })
    if (!ok) return
    setDeleting(true)
    setError(null)
    try {
      await deleteGamme(gamme.id)
      onGammeDeleted()
    } catch (err) {
      setError(apiErrorMessage(err))
      setDeleting(false)
    }
  }

  async function handleAddProduit() {
    setAdding(true)
    setProductsError(null)
    try {
      const produit = await createProduit(gamme.id, {
        type: { fr: 'Nouveau produit', en: 'New product' },
        poids: '',
        symbol: '❖',
        description: {
          fr: 'Décrivez ce produit avant de le mettre en ligne.',
          en: 'Describe this product before publishing it.',
        },
        details: null,
      })
      onProduitAdded(produit)
    } catch (err) {
      setProductsError(apiErrorMessage(err))
    } finally {
      setAdding(false)
    }
  }

  async function handleDeleteProduit(produit: Product) {
    const ok = await confirm({
      title: 'Supprimer le produit ?',
      message: (
        <>
          Le produit <strong>« {produit.type.fr} »</strong> sera retiré de la gamme {gamme.nom.fr}. Cette
          action est définitive.
        </>
      ),
      confirmLabel: 'Supprimer le produit',
    })
    if (!ok) return
    setProductsError(null)
    try {
      await deleteProduit(produit.id)
      onProduitRemoved(produit.id)
    } catch (err) {
      setProductsError(apiErrorMessage(err))
    }
  }

  return (
    <div className="space-y-8">
      {confirmModal}
      <section className="bg-white border border-[#3B1705]/10 p-6 space-y-5">
        <h2 className="text-xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
          Gamme {gamme.nom.fr || gamme.id}
        </h2>

        <LocalizedField label="Nom" value={form.nom} onChange={v => set('nom', v)} required />
        <LocalizedField label="Accroche (tagline)" value={form.tagline} onChange={v => set('tagline', v)} />
        <LocalizedField label="Ingrédients (résumé)" value={form.ingredients} onChange={v => set('ingredients', v)} />
        <LocalizedField
          label="Description"
          value={form.description}
          onChange={v => set('description', v)}
          multiline
          rows={4}
        />
        <LocalizedField
          label="Détail des ingrédients"
          value={form.ingredientsDetail}
          onChange={v => set('ingredientsDetail', v)}
          multiline
          rows={3}
        />

        <div className="grid md:grid-cols-3 gap-5">
          <ColorInput label="Couleur" value={form.color} onChange={v => set('color', v)} />
          <ColorInput label="Couleur claire" value={form.colorLight} onChange={v => set('colorLight', v)} />
          <ColorInput label="Couleur foncée" value={form.colorDark} onChange={v => set('colorDark', v)} />
        </div>

        <div className="border-t border-[#3B1705]/10 pt-5 space-y-4">
          <h3 className="text-[11px] tracking-[0.2em] uppercase text-[#3B1705]/60">
            Bandeau d'accueil de la gamme
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <LocalizedField label="Début du titre" value={form.heroLead} onChange={v => set('heroLead', v)} />
            <LocalizedField label="Fin du titre (dorée)" value={form.heroAccent} onChange={v => set('heroAccent', v)} />
          </div>
          <LocalizedField
            label="Texte d'introduction"
            value={form.heroCopy}
            onChange={v => set('heroCopy', v)}
            multiline
            rows={3}
          />
          <LocalizedField
            label="Texte alternatif de l'image (accessibilité)"
            value={form.heroAlt}
            onChange={v => set('heroAlt', v)}
            multiline
            rows={2}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 border-t border-[#3B1705]/10 pt-5">
          <ImagePicker
            label="Image de la gamme (cartes)"
            currentImage={gamme.image}
            fallbackImage={fallbackImage}
            onPick={async media => pickImage('imageId', media?.id ?? null)}
          />
          <ImagePicker
            label="Image principale"
            currentImage={gamme.mainImage}
            fallbackImage={fallbackImage}
            onPick={async media => pickImage('mainImageId', media?.id ?? null)}
          />
          <ImagePicker
            label="Grande image du bandeau"
            currentImage={gamme.heroImage}
            fallbackImage={statique?.heroImage}
            onPick={async media => pickImage('heroImageId', media?.id ?? null)}
          />
          <ImagePicker
            label="Petite image du bandeau (mobile)"
            currentImage={gamme.heroImageSmall}
            fallbackImage={statique?.heroImageSmall}
            onPick={async media => pickImage('heroImageSmallId', media?.id ?? null)}
          />
        </div>

        {error && <Banner kind="error">{error}</Banner>}
        {success && <Banner kind="success">Gamme enregistrée.</Banner>}

        <div className="flex items-center justify-between gap-4">
          <Button onClick={handleSave} disabled={saving || deleting}>
            {saving ? 'Enregistrement...' : 'Enregistrer la gamme'}
          </Button>
          {canDelete && (
            <Button variant="danger" onClick={handleDeleteGamme} disabled={saving || deleting}>
              {deleting ? 'Suppression...' : 'Supprimer la gamme'}
            </Button>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="text-[11px] tracking-[0.2em] uppercase text-[#3B1705]/60">
            Produits ({gamme.products.length})
          </h3>
          <Button variant="secondary" onClick={handleAddProduit} disabled={adding}>
            {adding ? 'Ajout...' : '+ Ajouter un produit'}
          </Button>
        </div>

        {productsError && (
          <div className="mb-4">
            <Banner kind="error">{productsError}</Banner>
          </div>
        )}

        {gamme.products.length === 0 ? (
          <p className="text-sm text-[#3B1705]/40">Aucun produit dans cette gamme pour l'instant.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {produitsOrdonnes.map(product => (
              <ProduitEditor
                key={product.id}
                product={product}
                gammeImage={gamme.mainImage ?? gamme.image ?? fallbackImage}
                gammeNom={gamme.nom}
                fallbackImage={staticGamme(gamme.id)?.products[gamme.products.indexOf(product)]?.image}
                onUpdated={onProduitUpdated}
                onDelete={() => handleDeleteProduit(product)}
                onDragStart={() => setDragId(product.id)}
                onDragEnd={() => {
                  setDragId(null)
                  setOverId(null)
                }}
                onDragOver={() => setOverId(product.id)}
                onDrop={() => handleDrop(product.id)}
                isDragSource={dragId === product.id}
                isDropTarget={dragId !== null && overId === product.id && dragId !== product.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function PromessesField({
  value,
  onChange,
}: {
  value: { fr: string[]; en: string[] }
  onChange: (value: { fr: string[]; en: string[] }) => void
}) {
  const toText = (items: string[]) => items.join('\n')
  const fromText = (text: string) =>
    text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)

  return (
    <div className="space-y-2">
      <p className="text-[11px] tracking-[0.15em] uppercase text-[#3B1705]/60">
        Promesses (une par ligne)
      </p>
      <div className="grid md:grid-cols-2 gap-3">
        <TextArea
          rows={3}
          value={toText(value.fr)}
          onChange={e => onChange({ ...value, fr: fromText(e.target.value) })}
        />
        <TextArea
          rows={3}
          value={toText(value.en)}
          onChange={e => onChange({ ...value, en: fromText(e.target.value) })}
        />
      </div>
    </div>
  )
}

function ProduitEditor({
  product,
  gammeImage,
  gammeNom,
  fallbackImage,
  onUpdated,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragSource,
  isDropTarget,
}: {
  product: Product
  gammeImage?: string
  gammeNom: Localized
  fallbackImage?: string
  onUpdated: (produit: Product) => void
  onDelete: () => void
  onDragStart: () => void
  onDragEnd: () => void
  onDragOver: () => void
  onDrop: () => void
  isDragSource: boolean
  isDropTarget: boolean
}) {
  const [form, setForm] = useState<ProduitForm>({
    type: product.type,
    poids: product.poids,
    symbol: product.symbol,
    description: product.description,
    details: product.details,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showDetails, setShowDetails] = useState(product.details !== null)
  const cardRef = useRef<HTMLDivElement>(null)

  function set<K extends keyof ProduitForm>(key: K, value: ProduitForm[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    setSuccess(false)
  }

  function toggleDetails(enabled: boolean) {
    setShowDetails(enabled)
    if (enabled && !form.details) {
      set('details', emptyDetails(form.type))
    }
    if (!enabled) {
      set('details', null)
    }
  }

  function setDetail<K extends keyof ProductDetails>(key: K, value: ProductDetails[K]) {
    setForm(prev => (prev.details ? { ...prev, details: { ...prev.details, [key]: value } } : prev))
    setSuccess(false)
  }

  async function handleSave() {
    if (!form.type.fr.trim() || !form.type.en.trim()) {
      setError('Le type de produit est requis en français et en anglais.')
      return
    }
    if (!form.poids.trim()) {
      setError('Le poids / contenant est requis.')
      return
    }
    if (form.details && !form.details.nom.fr.trim()) {
      setError('Le nom des détails produit est requis en français.')
      return
    }

    setSaving(true)
    setError(null)
    try {
      const updated = await updateProduit(product.id, form)
      onUpdated(updated)
      setSuccess(true)
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function pickImage(mediaId: number | null) {
    const updated = await updateProduit(product.id, { imageId: mediaId })
    onUpdated(updated)
  }

  return (
    <div
      ref={cardRef}
      onDragOver={e => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        onDragOver()
      }}
      onDrop={e => {
        e.preventDefault()
        onDrop()
      }}
      className={`bg-white border border-[#3B1705]/10 p-5 space-y-3 ${isDropTarget ? 'ring-2 ring-[#C97B1A]' : ''} ${
        isDragSource ? 'opacity-40' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            draggable
            onDragStart={e => {
              e.dataTransfer.effectAllowed = 'move'
              e.dataTransfer.setData('text/plain', String(product.id))
              if (cardRef.current) e.dataTransfer.setDragImage(cardRef.current, 20, 20)
              onDragStart()
            }}
            onDragEnd={onDragEnd}
            title="Glisser pour réordonner"
            aria-label={`Réordonner ${product.type.fr || 'ce produit'} par glisser-déposer`}
            className="cursor-grab active:cursor-grabbing text-[#3B1705]/40 hover:text-[#C97B1A] text-base leading-none flex-shrink-0 select-none px-0.5"
          >
            ⠿
          </span>
          <p className="text-[11px] tracking-[0.15em] uppercase text-[#3B1705]/60 truncate">
            {product.type.fr || 'Nouveau produit'}
          </p>
        </div>
        <Button variant="danger" onClick={onDelete}>
          Supprimer
        </Button>
      </div>

      <LocalizedField label="Type" value={form.type} onChange={v => set('type', v)} required />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Poids / contenant">
          <TextInput value={form.poids} onChange={e => set('poids', e.target.value)} placeholder="100 ml" />
        </Field>
        <Field label="Symbole">
          <TextInput value={form.symbol} onChange={e => set('symbol', e.target.value)} placeholder="◇" />
        </Field>
      </div>

      <LocalizedField
        label="Description"
        value={form.description}
        onChange={v => set('description', v)}
        multiline
        rows={3}
      />

      <ImagePicker
        label="Image du produit"
        currentImage={product.image}
        fallbackImage={fallbackImage ?? gammeImage}
        fallbackLabel={fallbackImage ? 'Image par défaut du site' : 'Image de la gamme'}
        onPick={async media => pickImage(media?.id ?? null)}
      />

      <label className="flex items-center gap-2 text-sm text-[#3B1705]/70">
        <input type="checkbox" checked={showDetails} onChange={e => toggleDetails(e.target.checked)} />
        Fiche détaillée (nom complet, actifs, conseils…)
      </label>

      {showDetails && form.details && (
        <div className="border border-[#3B1705]/10 bg-[#FAF6EF]/60 p-4 space-y-4">
          <LocalizedField label="Nom complet du produit" value={form.details.nom} onChange={v => setDetail('nom', v)} />
          <PromessesField value={form.details.promesses} onChange={v => setDetail('promesses', v)} />
          <LocalizedField label="Actifs" value={form.details.actifs} onChange={v => setDetail('actifs', v)} />
          <LocalizedField
            label="Propriétés"
            value={form.details.proprietes}
            onChange={v => setDetail('proprietes', v)}
            multiline
            rows={3}
          />
          <LocalizedField
            label="Ingrédients (INCI)"
            value={form.details.ingredients}
            onChange={v => setDetail('ingredients', v)}
            multiline
            rows={3}
          />
          <LocalizedField
            label="Mode d'emploi"
            value={form.details.modeEmploi}
            onChange={v => setDetail('modeEmploi', v)}
            multiline
            rows={3}
          />
          <LocalizedField
            label="Précautions"
            value={form.details.precautions}
            onChange={v => setDetail('precautions', v)}
            multiline
            rows={2}
          />
        </div>
      )}

      {error && <Banner kind="error">{error}</Banner>}
      {success && <Banner kind="success">Produit enregistré.</Banner>}

      <Button variant="secondary" onClick={handleSave} disabled={saving}>
        {saving ? 'Enregistrement...' : 'Enregistrer ce produit'}
      </Button>
      <p className="text-[11px] text-[#3B1705]/35">
        Produit affiché dans la gamme « {gammeNom.fr} ».
      </p>
    </div>
  )
}
