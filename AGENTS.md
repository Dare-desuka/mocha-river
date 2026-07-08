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

## Features
- Stats tracking (hands played, win rate, biggest win) — persisted
- Bot difficulty: Easy / Medium / Hard — adjust AI aggression & mistakes
- Bot turn delay (1.5s per bot) — bots act one-by-one with action badge (FOLD/CHECK/CALL/RAISE)
- Card flip animation on deal
- Table themes: Classic Green, Royal Blue, Midnight Purple, Crimson, Emerald
- Blind increase every 6 hands (10/20 → 200/400)
- Quick bet buttons in raise slider: 1/3, 1/2, 3/4, Pot
- Hand history modal after each hand
- Profile: custom photo (image picker) + editable name
- Leave mid-game resets, no auto-advance after showdown (Continue/Quit)

## Key files
- `src/game/types.ts` — Card types, suit colors, BotAction, BotDifficulty, BLIND_LEVELS
- `src/game/engine.ts` — Game engine, processOneBotAction
- `src/game/botAI.ts` — Bot AI with difficulty scaling
- `src/screens/GameScreen.tsx` — Main gameplay (table, action bar, showdown)
- `src/screens/SettingsScreen.tsx` — Sound, vibration, bot difficulty, table themes
- `src/screens/ProfileScreen.tsx` — Real stats display + photo/name editing
- `src/components/PokerCard.tsx` — Card with flip animation
- `src/components/PlayerSeat.tsx` — Player/bot seat with action badge
- `src/components/RaiseSlider.tsx` — Raise slider with pot fraction buttons
- `src/components/ShowdownModal.tsx` — Round results (Continue/Quit)
- `src/components/HandHistoryModal.tsx` — Detailed hand review
- `src/components/GameStatusBanner.tsx` — Phase, pot, blind level
- `src/constants/theme.ts` — Catppuccin palette, TABLE_THEMES
- `src/store/gameStore.ts` — Zustand store, bot delay loop, stats tracking
- `src/store/settingsStore.ts` — Settings with persistence
- `src/utils/storage.ts` — AsyncStorage persistence (chips, settings, stats, profile)

## Commands
- `npx expo start` — dev
- `npx tsc --noEmit` — typecheck
- `npm test` — typecheck + unit tests
- `npx eas build --platform android --profile preview` — build APK
