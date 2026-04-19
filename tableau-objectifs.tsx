"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus, Printer } from 'lucide-react'

interface SousAction {
  id: string
  texte: string
  complete: boolean
}

interface Objectif {
  id: string
  titre: string
  imageUrl: string
  sousActions: SousAction[]
}

export default function Component() {
  const [periode, setPeriode] = useState<string>("")
  const [objectifs, setObjectifs] = useState<Objectif[]>([])
  const [nouveauObjectif, setNouveauObjectif] = useState({
    titre: "",
    imageUrl: "",
    sousActions: [""]
  })
  const [why, setWhy] = useState("")

  const ajouterSousAction = () => {
    if (nouveauObjectif.sousActions.length < 5) {
      setNouveauObjectif({
        ...nouveauObjectif,
        sousActions: [...nouveauObjectif.sousActions, ""]
      })
    }
  }

  const supprimerSousAction = (index: number) => {
    if (nouveauObjectif.sousActions.length > 1) {
      setNouveauObjectif({
        ...nouveauObjectif,
        sousActions: nouveauObjectif.sousActions.filter((_, i) => i !== index)
      })
    }
  }

  const modifierSousAction = (index: number, valeur: string) => {
    const nouvelleSousActions = [...nouveauObjectif.sousActions]
    nouvelleSousActions[index] = valeur
    setNouveauObjectif({
      ...nouveauObjectif,
      sousActions: nouvelleSousActions
    })
  }

  const ajouterObjectif = () => {
    if (nouveauObjectif.titre && nouveauObjectif.imageUrl && objectifs.length < 5) {
      const objectif: Objectif = {
        id: Date.now().toString(),
        titre: nouveauObjectif.titre,
        imageUrl: nouveauObjectif.imageUrl,
        sousActions: nouveauObjectif.sousActions
          .filter(sa => sa.trim() !== "")
          .map(sa => ({
            id: Date.now().toString() + Math.random(),
            texte: sa,
            complete: false
          }))
      }
      setObjectifs([...objectifs, objectif])
      setNouveauObjectif({
        titre: "",
        imageUrl: "",
        sousActions: [""]
      })
    }
  }

  const supprimerObjectif = (id: string) => {
    setObjectifs(objectifs.filter(obj => obj.id !== id))
  }

  const toggleSousAction = (objectifId: string, sousActionId: string) => {
    setObjectifs(objectifs.map(obj => {
      if (obj.id === objectifId) {
        return {
          ...obj,
          sousActions: obj.sousActions.map(sa =>
            sa.id === sousActionId ? { ...sa, complete: !sa.complete } : sa
          )
        }
      }
      return obj
    }))
  }

  const imprimer = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-4 print:hidden">
          <img
            src="https://studioyvesamyot.com/wp-content/uploads/2025/08/logo-avohs.png"
            alt="Logo"
            className="mx-auto"
            style={{ height: '160px', width: 'auto' }}
          />
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
            Tableau d'Objectifs Visuel
          </h1>
        </div>

        {/* Section de configuration - masquée à l'impression */}
        <div className="print:hidden mb-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="why">Votre Why (motivation profonde)</Label>
                <Input
                  id="why"
                  value={why}
                  onChange={(e) => setWhy(e.target.value)}
                  placeholder="Ex: Je veux vivre de ma passion, être fier de moi, et montrer à mes enfants qu'on peut suivre ses rêves."
                />
              </div>

              <div>
                <Label htmlFor="periode">Période</Label>
                <Select value={periode} onValueChange={setPeriode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez une période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annuel">Annuel</SelectItem>
                    <SelectItem value="trimestriel">Trimestriel</SelectItem>
                    <SelectItem value="mensuel">Mensuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {periode && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold">Ajouter un objectif ({objectifs.length}/5)</h3>

                  <div>
                    <Label htmlFor="titre">Titre de l'objectif</Label>
                    <Input
                      id="titre"
                      value={nouveauObjectif.titre}
                      onChange={(e) => setNouveauObjectif({...nouveauObjectif, titre: e.target.value})}
                      placeholder="Ex: Obtenir (nombre) mandats en voix off d'ici le (date)."
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">URL de l'image</Label>
                    <Input
                      id="image"
                      value={nouveauObjectif.imageUrl}
                      onChange={(e) => setNouveauObjectif({...nouveauObjectif, imageUrl: e.target.value})}
                      placeholder="https://exemple.com/image.jpg"
                    />
                  </div>

                  <div>
                    <Label>Sous-actions ({nouveauObjectif.sousActions.length}/5)</Label>
                    {nouveauObjectif.sousActions.map((sousAction, index) => (
                      <div key={index} className="flex gap-2 mt-2">
                        <Input
                          value={sousAction}
                          onChange={(e) => modifierSousAction(index, e.target.value)}
                          placeholder={`Sous-action ${index + 1}`}
                        />
                        {nouveauObjectif.sousActions.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => supprimerSousAction(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {nouveauObjectif.sousActions.length < 5 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={ajouterSousAction}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une sous-action
                      </Button>
                    )}
                  </div>

                  <Button
                    onClick={ajouterObjectif}
                    disabled={!nouveauObjectif.titre || !nouveauObjectif.imageUrl || objectifs.length >= 5}
                    className="w-full"
                  >
                    Ajouter l'objectif
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bouton d'impression */}
        {objectifs.length > 0 && (
          <div className="print:hidden mb-6 text-center">
            <Button onClick={imprimer} className="bg-blue-600 hover:bg-blue-700">
              <Printer className="h-4 w-4 mr-2" />
              Imprimer le tableau
            </Button>
          </div>
        )}

        {/* En-tête pour l'impression */}
        {periode && objectifs.length > 0 && (
          <div className="hidden print:flex print:flex-row print:items-start print:gap-4 print:mb-6 print:w-full print:pl-4">
            {/* Logo à gauche */}
            <div className="print:shrink-0">
              <img
                src="https://studioyvesamyot.com/wp-content/uploads/2025/08/logo-avohs.png"
                alt="Logo"
                className="print:h-[60px] print:w-auto"
              />
            </div>

            {/* Texte à droite du logo */}
            <div className="print:flex print:flex-col print:justify-center print:items-start print:gap-1">
              <h1 className="print:text-xl font-bold text-black leading-tight">
                Tableau d'Objectifs Visuel
              </h1>

              <h2 className="print:text-lg font-semibold text-black leading-tight">
                Objectifs {periode.charAt(0).toUpperCase() + periode.slice(1)}s
              </h2>

              {why && (
                <div className="italic text-black print:text-sm leading-tight">
                  Mon Why : {why}
                </div>
              )}

              <p className="text-black print:text-sm leading-tight">
                {new Date().toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        )}

        {/* Grille des objectifs */}
        {objectifs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
            {objectifs.map((objectif) => (
              <Card key={objectif.id} className="overflow-hidden print:break-inside-avoid print:shadow-none print:border-2">
                <div className="relative">
                  <img
                    src={objectif.imageUrl || "/placeholder.svg"}
                    alt={objectif.titre}
                    className="w-full h-48 object-contain print:h-32"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(objectif.titre)}`;
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 print:hidden"
                    onClick={() => supprimerObjectif(objectif.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardHeader className="print:pb-2">
                  <CardTitle className="text-lg print:text-base">{objectif.titre}</CardTitle>
                </CardHeader>
                <CardContent className="print:pt-0">
                  <div className="space-y-3 print:space-y-2">
                    {objectif.sousActions.map((sousAction) => (
                      <div key={sousAction.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={sousAction.id}
                          checked={sousAction.complete}
                          onCheckedChange={() => toggleSousAction(objectif.id, sousAction.id)}
                          className="print:scale-125"
                        />
                        <label
                          htmlFor={sousAction.id}
                          className={`text-sm flex-1 cursor-pointer print:text-xs ${
                            sousAction.complete ? 'line-through text-gray-500' : ''
                          }`}
                        >
                          {sousAction.texte}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {objectifs.length === 0 && periode && (
          <div className="text-center py-12 print:hidden">
            <p className="text-gray-500 text-lg">
              Commencez par ajouter votre premier objectif ci-dessus
            </p>
          </div>
        )}

        {!periode && (
          <div className="text-center py-12 print:hidden">
            <p className="text-gray-500 text-lg">
              Choisissez d'abord une période pour commencer
            </p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:flex {
            display: flex !important;
          }
          .print\\:flex-row {
            flex-direction: row !important;
          }
          .print\\:flex-col {
            flex-direction: column !important;
          }
          .print\\:items-start {
            align-items: flex-start !important;
          }
          .print\\:justify-center {
            justify-content: center !important;
          }
          .print\\:gap-1 {
            gap: 0.25rem !important;
          }
          .print\\:gap-4 {
            gap: 1rem !important;
          }
          .print\\:mb-6 {
            margin-bottom: 1.5rem !important;
          }
          .print\\:w-full {
            width: 100% !important;
          }
          .print\\:pl-4 {
            padding-left: 1rem !important;
          }
          .print\\:shrink-0 {
            flex-shrink: 0 !important;
          }
          .print\\:h-\\[60px\\] {
            height: 60px !important;
          }
          .print\\:w-auto {
            width: auto !important;
          }
          .print\\:text-xl {
            font-size: 1.25rem !important;
          }
          .print\\:text-lg {
            font-size: 1.125rem !important;
          }
          .print\\:text-sm {
            font-size: 0.875rem !important;
          }
          .print\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-2 {
            border-width: 2px !important;
          }
          .print\\:h-32 {
            height: 8rem !important;
          }
          .print\\:pb-2 {
            padding-bottom: 0.5rem !important;
          }
          .print\\:pt-0 {
            padding-top: 0 !important;
          }
          .print\\:space-y-2 > * + * {
            margin-top: 0.5rem !important;
          }
          .print\\:text-base {
            font-size: 1rem !important;
          }
          .print\\:text-xs {
            font-size: 0.75rem !important;
          }
          .print\\:scale-125 {
            transform: scale(1.25) !important;
          }
          .print\\:text-black {
            color: black !important;
          }
        }
      `}</style>
    </div>
  )
}
