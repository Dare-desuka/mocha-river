# Mocha River — Texas Hold'em Poker

## Stack
- React Native / Expo SDK
- EAS Build (Cloud)
- Catppuccin Mocha theme
- Montserrat font

## App Config
- slug: `mocha-river`
- EAS project: `@onecode311/mocha-river`
- projectId: `f19311af-be1c-4016-a2f0-4e938fc7e483`
- Build: `eas build --platform android --profile preview`

## Colors
- Card bg: `#cdd6f4` (base)
- hearts/diamonds: `#d20f39` (red)
- clubs/spades: `#11111b` (black)
- table bg: `#1e1e2e` (mantle)

## Features added
- Stats tracking (hands played, win rate, biggest win) — persisted in AsyncStorage
- Bot difficulty: Easy / Medium / Hard — adjust AI aggression & mistakes
- Bot turn delay (1.5s per bot) — bots act one-by-one with visible action text
- Bot action text appears above bot seats when they act

## Key files
- `src/game/types.ts` — Card types, suit colors, BotAction, BotDifficulty, constants
- `src/game/engine.ts` — Game engine, processOneBotAction
- `src/game/botAI.ts` — Bot AI with difficulty scaling
- `src/screens/GameScreen.tsx` — Main gameplay
- `src/screens/SettingsScreen.tsx` — Sound, vibration, difficulty
- `src/screens/ProfileScreen.tsx` — Real stats display
- `src/components/PokerCard.tsx` — Card rendering
- `src/components/PlayerSeat.tsx` — Player/bot seat with action text
- `src/store/gameStore.ts` — Zustand store, bot delay loop, stats tracking
- `src/utils/storage.ts` — AsyncStorage persistence (chips, settings, stats)

## Commands
- `npx expo start` — dev
- `npx tsc --noEmit` — typecheck
- `npm test` — typecheck + unit tests
- `npx eas build --platform android --profile preview` — build APK
