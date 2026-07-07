# Stitch Ace Poker — Offline Texas Hold'em (React Native + Expo)

## Tech Stack
React Native + Expo SDK 56, TypeScript, Zustand, AsyncStorage, React Navigation.

## Struktur Folder
```
src/
  components/   — PokerCard, PlayerSeat, RaiseSlider, GameStatusBanner, ShowdownModal
  screens/      — HomeScreen, GameScreen, TutorialScreen, SettingsScreen, ProfileScreen
  game/         — deck, handEvaluator, botAI, gameEngine, types
  store/        — gameStore, settingsStore
  utils/        — storage, format, soundManager, haptics
  constants/    — theme
```

## Game Logic

### Hand Evaluator (`src/game/handEvaluator.ts`)
- `evaluateBestHand(cards)`: C(7,5)=21 kombinasi, cari skor tertinggi
- Scoring: `base * 100^5 + k1*100^4 + k2*100^3 + k3*100^2 + k4*100 + k5` (5 kicker, di-pad 0)
- Wheel straight (A-2-3-4-5): return high = 5
- Ranking: high_card(1) < one_pair(2) < two_pair(3) < three_of_a_kind(4) < straight(5) < flush(6) < full_house(7) < four_of_a_kind(8) < straight_flush(9) < royal_flush(10)

### Game Engine (`src/game/gameEngine.ts`)
- Betting round: `roundActionsSinceLastRaise` counter, selesai ketika ≥ activePlayers
- Preflop: `lastRaiserIndex=bbIdx, roundActionsSinceLastRaise=1` (BB option fix)
- Short all-in raise (< minRaise): tidak reopen betting, dianggap call dengan excess
- `actionLog`: spread `[...log, msg]`, jangan `.push()` (Zustand reactivity)
- Bot action: `setTimeout(processBotRound, 500)` via gameStore

### Bot AI (`src/game/botAI.ts`)
- Preflop score 0-1: pair/rank/suited/connector/gap/broadway bonus
- Postflop score 0-1: `HAND_RANK_VALUES[hand.rank] * 0.1 - 0.1 + kickers[0] / 140`
- Position awareness: early(0.7x), middle(0.85x), late(1.15x), blind(0.9x)
- Bluff: 15% late position dengan hand < 0.3
- Nut hand (>0.92): value bet 75% pot
- Very strong (>0.8): raise/re-raise 2.5x, all-in kalau pendek
- Strong (>0.65): raise 35% (dipengaruhi posisi), call otherwise
- Medium (>0.4): call kalau murah + pot odds bagus
- Weak (<0.4): fold unless pot odds super bagus + 20% random call
- Bet sizing: fraction of pot, dipengaruhi position aggression

### Sound Manager (`src/utils/soundManager.ts`)
- `playSound(name)`: `'deal' | 'chip' | 'win' | 'turn'`
- Preload via `initSound()` di App.tsx
- Cek `soundEnabled` dari settingsStore
- Butuh `expo-av`

### Haptics (`src/utils/haptics.ts`)
- `vibrate(pattern)`: wrapper Vibration API, cek `vibrationEnabled`
- Dipanggil: turn(50ms), action(30ms), win([0,100,50,100,50,150])

### Storage (`src/utils/storage.ts`)
- `saveChipBalance` / `loadChipBalance` — chip player persist
- `saveSettings` / `loadSettings` — soundEnabled, vibrationEnabled
- `resetChipBalance` — inlined ke `saveChipBalance(STARTING_CHIPS)`

## UI / Desain
- Catppuccin Mocha palette + Montserrat font
- Kartu: bg `#cdd6f4`, radius 8, ukuran 56x80 (hole) / 48x64 (community + bot)
- Action buttons: Fold/Check/Call neutral (surfaceHighest), Raise primary blue (wider)
- Tabel: oval aspectRatio 4/5, maxWidth 340, warna hardcoded (`TABLE_COLORS`)
- Pot: glass panel inside table
- Showdown: modal glass + pulse winner + auto-next countdown 5s
- Settings: Sound + Vibration toggle, Reset Chip Balance
- Bottom nav: Play Now + Profile (Tournaments/Shop dihapus)

## Testing
```bash
npm run typecheck          # tsc --noEmit
npm run test:unit          # handEvaluator + gameEngine
npm test                   # typecheck + test:unit
```

## Build & Run
```bash
npx expo start                      # dev
npx expo run:android                # development build
eas build --platform android --profile preview   # APK
eas build --platform android --profile production # AAB
```

## Catatan
- Jangan tambah dependensi baru tanpa perlu
- Icon pakai `@expo/vector-icons` (MaterialIcons)
- `react-native-gesture-handler` tidak dipakai (PanResponder cukup)
- `expo-linear-gradient` masih dipakai di TutorialScreen
- Multiplayer via Supabase: lihat `/home/wahid/game/poker/supabase-setup.txt`