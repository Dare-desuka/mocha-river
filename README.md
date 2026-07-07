# Stitch Ace Poker

Offline Texas Hold'em Poker — 1 pemain vs 3 bot. React Native + Expo.

## Install & Jalankan

```bash
cd poker-app
npm install
npx expo start
```

Scan QR dengan Expo Go, atau tekan `a` untuk Android emulator.

## Build APK

```bash
npx expo run:android                    # development build
eas build --platform android --profile preview   # APK production
```

## Cara Main

- **Blinds**: SB 10, BB 20, starting chips 1000
- **Betting**: Preflop → Flop (3 kartu) → Turn (1) → River (1) → Showdown
- **Aksi**: Fold, Check, Call, Raise, All In
- Bot pakai AI dengan posisi, bluff, pot odds, dan bet sizing dinamis

## Struktur

```
src/
  components/   — PokerCard, PlayerSeat, RaiseSlider, GameStatusBanner, ShowdownModal
  screens/      — Home, Game, Tutorial, Settings, Profile
  game/         — deck, handEvaluator, botAI, gameEngine, types
  store/        — gameStore, settingsStore (Zustand)
  utils/        — storage, format, soundManager, haptics
  constants/    — theme (Catppuccin Mocha)
```

## Fitur

- Kartu render View+Text (tanpa image), ukuran 56×80 / 48×64
- Sound effects (chip, deal, win, turn) + haptic feedback
- Pot side-pot untuk all-in multi pemain
- Hand evaluator C(7,5) — semua 10 ranking + wheel straight
- Chip balance persist di AsyncStorage
- Dark theme Catppuccin Mocha, Montserrat font

## Tech Stack

React Native / Expo SDK 56, TypeScript, Zustand, AsyncStorage, React Navigation.
