# SuperApp Famille Mobile V4 modulaire

Version issue de la V2 exploitable, renforcée sans refonte graphique.

## Points renforcés

- Couche de compatibilité entre anciennes clés techniques et clés cibles : `maison`, `courses_repas`, `education`, `sante`, `sport_loisirs`, `familles`, `calendrier`.
- Accueil, modules, calendrier, notifications et paramètres davantage actionnables.
- Cartes membres et dossiers membres cliquables.
- Ajout ciblé par module et par type d’élément.
- Calendrier global alimenté par les objets sources des modules.
- Suppression logique compatible synchronisation : les éléments supprimés sont marqués `pending_delete` au lieu d’être effacés brutalement.
- Export JSON V4 modulaire avec enveloppe commune `superapp_famille` et structure cible : paramètres, membres, modules, catégories, sous-catégories, éléments, documents, notifications, synchronisation.
- Import avec sauvegarde locale préalable, fusion par `id`, comparaison `updatedAt` et rapport d’import.

## Règle importante

Le design validé, les images et la philosophie graphique de la V2 sont conservés.


## V4.1 — Paramètres autonomes

Cette version renforce les paramètres mobiles : membres du foyer, applications activées, notifications, catégories, sous-catégories, données de référence par application, apparence, sauvegarde et synchronisation. Le mobile peut fonctionner seul avec au moins une application active ; la synchronisation reste réservée à la connexion mobile ↔ cockpit ordinateur, à l'import/export, à la fusion et aux conflits.
