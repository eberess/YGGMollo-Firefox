<p align="center">
  <img src="icons/icon.png" alt="YGGMollo" width="128">
</p>

# YGGMollo - Extension Firefox

[![Latest Release](https://img.shields.io/github/v/release/eberess/YGGMollo-Firefox?display_name=tag&logo=github)](https://github.com/eberess/YGGMollo-Firefox/releases/latest)

Extension Firefox qui ajoute un bouton pour télécharger les torrents YGGTorrent via [Ygg-API](https://yggapi.eu).

> Fork et portage Firefox (Manifest V3) de l'extension Chrome originale par [Almottier](https://github.com/almottier/YGGMollo)

![Screenshot](assets/screenshot.png)

## Installation

### Méthode recommandée (XPI signé, permanent)

1. Téléchargez le XPI signé depuis la dernière release:
   - https://github.com/eberess/YGGMollo-Firefox/releases/latest
   - Exemple de fichier: `5471eef6ded541079b6e-1.0.0.xpi`
2. Dans Firefox, ouvrez `about:addons`
3. Cliquez sur la roue dentée → "Installer un module depuis un fichier…"
4. Sélectionnez le fichier `.xpi` téléchargé → Validez

L’extension est installée de façon permanente (signée AMO, persiste après redémarrage).

### Méthode alternative (développement, temporaire)

1. Ouvrez Firefox et allez sur `about:debugging`
2. Cliquez sur **"Ce Firefox"** → **"Charger un module complémentaire temporaire..."**
3. Sélectionnez le fichier `manifest.json`

### Configuration

1. Ouvrez les **Options** de l'extension
2. Entrez votre **passkey YGGTorrent** (disponible dans votre profil YGGTorrent)
3. Cliquez sur **Enregistrer**

Vous verrez maintenant un bouton "Télécharger (Ygg-API)" sur les pages de torrents YGGTorrent.

## Mises à jour

- Cette extension n’est pas listée sur AMO (non publiée publiquement) : il n’y a donc pas de mise à jour automatique via le store.
- Pour mettre à jour, téléchargez simplement le dernier fichier XPI depuis la page Releases, puis réinstallez-le via `about:addons` → roue dentée → "Installer un module depuis un fichier…".
- Les versions sont numérotées (ex: 1.0.0, 1.0.1, …). Pensez à remplacer l’ancienne version par la nouvelle.
- Note pour testeurs: si vous rencontrez un souci après mise à jour, supprimez l’ancienne extension puis installez la nouvelle XPI.

## Développement

```bash
make build    # Crée build/yggmollo-firefox-v1.0.0.zip
make clean    # Nettoie le dossier build
```

## Licence

MIT
