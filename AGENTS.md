# Mocha River — Texas Hold'em Poker

## Stack
- React Native / Expo SDK
- EAS Build (Cloud)
- Catppuccin Mocha theme
- Montserrat font

## App Config
- app.json slug: `stitch-ace-poker` (EAS project match)
- EAS projectId: `fd757005-b117-4939-aeeb-95cc739698ed`
- Build: `eas build --platform android --profile preview`

## Colors
- Card bg: `#cdd6f4` (base)
- hearts/diamonds: `#d20f39` (red)
- clubs/spades: `#11111b` (black)
- table bg: `#1e1e2e` (mantle)

## Key files
- `src/game/types.ts` — Card types, suit colors, constants
- `src/game/engine.ts` — Game engine
- `src/screens/GameScreen.tsx` — Main gameplay
- `src/components/PokerCard.tsx` — Card rendering

## Commands
- `npx expo start` — dev
- `npx tsc --noEmit` — typecheck
- `npx eas build --platform android --profile preview` — build APK
