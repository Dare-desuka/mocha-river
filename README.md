# Mocha River

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
npx eas build --platform android --profile preview
```

## Cara Main

- **Blinds**: SB 10, BB 20, naik tiap 6 hand (10/20 → 200/400)
- **Starting chips**: 1000
- **Betting rounds**: Preflop → Flop (3 kartu) → Turn (1) → River (1) → Showdown
- **Aksi**: Fold, Check, Call, Raise (slider 5+/10+/20+/100+/1000+), All In
- **Dealer button** (D) bergilir tiap hand
- **Side pot** otomatis untuk all-in multi pemain
- Bot AI dengan posisi, bluff, pot odds, dan bet sizing dinamis

## Struktur

```
src/
  components/   — PokerCard, PlayerSeat, RaiseSlider, GameStatusBanner, ShowdownModal
  screens/      — Home, Game, Tutorial, Settings, Profile
  game/         — deck, handEvaluator, botAI, gameEngine, types
  store/        — gameStore, settingsStore (Zustand)
  utils/        — storage, format, soundManager, i18n
  constants/    — theme (Catppuccin Mocha), lang (EN/ID)
```

## Fitur

- **i18n** — EN/ID, 120+ key, toggle di Settings
- **Tutorial** — 7 basics + 10 hand rankings, full translated
- **Table themes** — Classic Green, Royal Blue, Midnight Purple, Crimson, Emerald
- **Card backs** — Classic, Diamond, Royal (CSS-only)
- **Sound packs** — Classic, Arcade, Muted (synthesized WAV, 9 suara per pack)
- **Bot difficulty** — Easy / Medium / Hard (aggression & mistakes)
- **Raise slider** — preset 5+/10+/20+/100+/1000+ + draggable
- **Stats tracking** — hands played, win rate, biggest win (persisted)
- **Profile** — custom photo (image picker) + editable name
- **Splash background** — semua halaman pakai splash-icon.png
- **Chip logo MR** — Mocha River chip icon di semua seat & pot
- **Dealer badge** — lingkaran hitam "D" di avatar dealer
- **Hand history** — review detail setiap hand setelah showdown
- **Card flip animation** — spring animation pada deal
- **Kartu render View+Text** (tanpa image), ukuran 56×80 / 48×64
- **Hand evaluator** C(7,5) — semua 10 ranking + wheel straight
- **Chip balance persist** di AsyncStorage
- **Dark theme Catppuccin Mocha**, Montserrat font

## Tech Stack

React Native / Expo SDK 54, TypeScript, Zustand, AsyncStorage,
React Navigation, expo-av, expo-font, expo-image-picker,
expo-linear-gradient, @expo/vector-icons.
