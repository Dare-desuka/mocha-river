# Stitch Ace Poker

Offline Texas Hold'em Poker single player game built with React Native + Expo.

## Cara Install

```bash
cd poker-app
npm install
```

## Cara Menjalankan

```bash
npx expo start
```

Lalu scan QR code dengan Expo Go, atau tekan `a` untuk Android emulator.

## Cara Build APK

### Development build:
```bash
npx expo run:android
```

### Production APK (using EAS Build):
```bash
npm install -g eas-cli
eas build --platform android --profile preview
```

Atau build lokal dengan:
```bash
cd android
./gradlew assembleRelease
```

## Alur Game

1. **Home Screen** - Tampilkan chip balance, tombol Play, Tutorial, Settings
2. **Game Screen** - 1 player vs 3 bot, Texas Hold'em dengan 4 betting rounds
3. **Tutorial Screen** - Penjelasan aturan poker dan hand rankings
4. **Settings Screen** - Sound, vibration, table theme

### Betting Rounds
- **Preflop**: Masing-masing dapat 2 kartu, taruhan dimulai dari kiri big blind
- **Flop**: 3 kartu community dibuka
- **Turn**: 1 kartu community
- **River**: 1 kartu community
- **Showdown**: Bandingkan kartu, pemenang dapat pot

### Player Actions
- Fold, Check, Call, Raise, All In

### Hand Rankings (low → high)
1. High Card
2. One Pair
3. Two Pair
4. Three of a Kind
5. Straight
6. Flush
7. Full House
8. Four of a Kind
9. Straight Flush
10. Royal Flush

### Blinds
- Small Blind: 10 chips
- Big Blind: 20 chips
- Starting chips: 1000

## Struktur Folder

```
src/
  components/   - UI components (PokerCard, PlayerSeat, dll)
  screens/      - Screen pages (Home, Game, Tutorial, Settings)
  game/         - Game logic (deck, handEvaluator, pokerRules, botAI, gameEngine, types)
  store/        - State management (gameStore, settingsStore)
  utils/        - Utilities (storage, format)
  constants/    - Theme constants
```

## Fitur yang Belum Ada

- [ ] Multiplayer online
- [ ] Animasi kartu dan chip
- [ ] Sound effects
- [ ] Re-buy chip
- [ ] History hand
- [ ] Statistik player
- [ ] Various table themes
- [ ] Custom blind amounts
- [ ] Tournament mode

## Tech Stack

- React Native / Expo SDK 56
- TypeScript
- Zustand (state management)
- AsyncStorage (persistence)
- React Navigation (screen navigation)

## Catatan

- Game ini 100% offline, tidak perlu koneksi internet
- Tidak perlu login atau registrasi
- Bot menggunakan AI sederhana berdasarkan hand strength
- Chip balance disimpan di AsyncStorage
