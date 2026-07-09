# Mocha River — Texas Hold'em Poker

## Stack
- React Native 0.81 / Expo SDK 54
- EAS Build (Cloud) — `eas build --platform android --profile preview`
- TypeScript, Zustand, AsyncStorage, React Navigation
- Catppuccin Mocha theme, Montserrat font

## App Config
- slug: `mocha-river`
- EAS project: `@onecode311/mocha-river`
- projectId: `f19311af-be1c-4016-a2f0-4e938fc7e483`

## Colors
- Card bg: `#cdd6f4` (base), hearts/diamonds: `#d20f39` (red), clubs/spades: `#11111b` (black)
- Table bg: `#1e1e2e` (mantle)

## Features (Implemented)
- 1 player vs 3 bot, blind increase every 6 hands (10/20 → 200/400)
- Betting rounds: Preflop → Flop → Turn → River → Showdown
- Actions: Fold, Check, Call, Raise (slider 5+/10+/20+/100+/1000+), All-In
- Bot AI with 3 difficulty levels (Easy/Medium/Hard)
- Side pot for multi-player all-in
- Hand evaluator C(7,5) — all 10 rankings + wheel straight
- i18n EN/ID (120+ keys), toggle in Settings
- Tutorial: 7 basics + 10 hand rankings (fully translated)
- Table themes (5), Card backs (3), Sound packs (3)
- Stats tracking (hands, win rate, biggest win) — persisted
- Profile: custom photo (image picker) + editable name
- Hand history modal after showdown
- Card flip animation (spring)
- Dealer badge, Chip MR logo, Info label (hand/blinds)
- Splash background on all screens
- Haptic feedback

## Key Files
- `src/game/types.ts` — Card types, BLIND_LEVELS, BotDifficulty, etc.
- `src/game/engine.ts` — Game engine, processOneBotAction
- `src/game/botAI.ts` — Bot AI with difficulty scaling
- `src/screens/GameScreen.tsx` — Main gameplay (table, action bar, showdown)
- `src/screens/SettingsScreen.tsx` — Sound, vibration, bot difficulty, table themes, language
- `src/screens/ProfileScreen.tsx` — Stats display + photo/name editing
- `src/components/PokerCard.tsx` — Card with flip animation
- `src/components/PlayerSeat.tsx` — Player/bot seat with dealer badge, chip count, action badge
- `src/components/RaiseSlider.tsx` — Raise slider with preset buttons
- `src/components/ShowdownModal.tsx` — Round results (Continue/Quit)
- `src/components/HandHistoryModal.tsx` — Detailed hand review
- `src/components/GameStatusBanner.tsx` — Pot display (chip logo + amount)
- `src/constants/theme.ts` — Catppuccin palette, TABLE_THEMES, COLORS
- `src/constants/lang.ts` — EN/ID translations
- `src/store/gameStore.ts` — Zustand store, bot delay loop, stats tracking
- `src/store/settingsStore.ts` — Settings with persistence
- `src/utils/storage.ts` — AsyncStorage persistence (chips, settings, stats, profile)
- `src/utils/i18n.ts` — useT() hook + t() utility
- `src/utils/soundManager.ts` — Sound effects via expo-audio (was expo-av)
- `src/utils/haptics.ts` — Haptic feedback
- `src/utils/format.ts` — Chip formatting

## Commands
- `npx expo start` — dev
- `npx expo start --web` — web preview
- `npx tsc --noEmit` — typecheck
- `npm test` — typecheck + unit tests
- `npx eas build --platform android --profile preview` — build APK

## Future Plan — Multiplayer Online
- **Real-time Texas Hold'em** via WebSocket + Node.js server
- **Lobby**: create/join room, minimal 2 players
- **Turn-based sync** via server, timeout jika pemain AFK
- **Spectator mode** untuk pemain yang sudah fold
- **Chat in-game** (opsional)
- **Profile photo & name** dari akun
- **Room management**: join code, player list, ready status
- **Game state sync**: hole cards, community cards, pot, actions
- **Timer per turn** untuk mencegah stall
- **Reconnect** jika koneksi putus
