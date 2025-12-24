<p align="center">
  <img src="icons/icon.png" alt="YGGMollo" width="128">
</p>

# YGGMollo WebExtension (Portage Firefox)

**Extension Firefox** qui ajoute un bouton "Télécharger via [Ygg-API](https://yggapi.eu)" sur les pages YGGTorrent. Ce projet est un fork de l'extension Chrome originale.

---

### 🙏 Attribution et Remerciements

Ce projet est un **fork** et un portage de l'extension Chrome originale **YGGMollo**, initialement créée par **Almottier** ([almottier/YGGMollo](https://github.com/almottier/YGGMollo)). Nous tenons à remercier l'auteur pour son excellent travail initial sous licence MIT.

---

Il n'y a donc plus de limite de temps ni sur le nombre de torrents téléchargés.

![Screenshot](assets/screenshot.png)

## Fonctionnalités

- Sauvegardez votre passkey dans les paramètres de l'extension
- Ajoute un bouton `Télécharger YGG-API` sur la page à côté du bouton de téléchargement normal
- En cliquant sur ce bouton, le torrent sera téléchargé via ygg-api

## Installation

### Firefox Add-ons (AMO)

*(Prochainement)*

### Installation manuelle pour le développement

1. Téléchargez le projet (ou clonez le dépôt `yggmollo-firefox`).
2. Ouvrez Firefox et tapez `about:debugging` dans la barre d'adresse.
3. Allez dans la section **"Ce Firefox"**.
4. Cliquez sur le bouton **"Charger un module complémentaire temporaire..."**.
5. Sélectionnez le dossier racine de votre projet (`yggmollo-firefox`).

## Développement

### Build
```bash
make build    # Crée build/yggmollo-firefox-v1.0.0.zip (vérifiez les scripts de 'make' pour la compatibilité)
make clean    # Nettoie le dossier build
```
### Licence
MIT
