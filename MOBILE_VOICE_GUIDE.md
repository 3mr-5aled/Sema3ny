# Mobile Text-to-Speech Guide

## Overview
The Sema3ny app uses the Web Speech API to provide American and British English pronunciation for vocabulary words. However, mobile browsers have limited voice support compared to desktop.

## Mobile Browser Limitations

### iOS Safari
- **Available Voices**: Limited to built-in iOS voices
- **British English**: May have voices like "Daniel", "Kate", or "Serena"
- **American English**: May have voices like "Samantha", "Alex", or "Nicky"
- **Important**: Voices are loaded asynchronously and require user interaction

### Android Chrome
- **Available Voices**: Depends on Android TTS engine installed
- **British English**: May have voices like "en-gb-x-rjs-local" or "en-gb-x-rjs-network"
- **American English**: May have voices like "en-us-x-sfg-local" or "en-us-x-sfg-network"
- **Note**: Online voices (network) require internet connection

## What We've Implemented

### 1. Enhanced Voice Detection
- Added mobile-specific voice names (iOS: Daniel, Kate, Samantha, Alex)
- Added Android-specific voice names (en-gb-x-*, en-us-x-*)
- Case-insensitive language matching for better compatibility
- Multiple fallback strategies to find the best available voice

### 2. User Feedback
- When British voice is not available, displays a temporary warning message
- Console logging to help debug voice availability issues
- Visual feedback during voice playback (spinning animation)

### 3. Voice Loading Optimization
- Attempts to load voices immediately on component mount
- Sets up listener for `voiceschanged` event (critical for mobile)
- Fallback timeout to try loading voices again after 100ms

## Troubleshooting

### British Accent Not Working on Mobile

**Check 1: Available Voices**
1. Open browser console on mobile device (use Remote Debugging)
2. Click any pronunciation button
3. Look for the log: "Available voices: ..."
4. Check if any voice has "en-GB" or contains "British"/"UK"

**Check 2: Device Settings**
- **iOS**: Go to Settings → Accessibility → Spoken Content → Voices → English
  - Download "English (UK)" voices if available
- **Android**: Go to Settings → System → Languages & input → Text-to-speech
  - Install additional voice data for "English (United Kingdom)"

**Check 3: Browser Compatibility**
- Safari on iOS: Best support
- Chrome on iOS: Uses Safari's engine, same voice support
- Chrome on Android: Good support, depends on TTS engine
- Firefox on Android: Limited support

### Fallback Behavior
If no British voice is found:
1. App displays warning: "British accent not available on this device"
2. Button interaction is disabled for 3 seconds
3. American accent remains available as alternative

## For Developers

### Testing Voice Availability
```javascript
// In browser console on mobile device:
const voices = speechSynthesis.getVoices();
console.table(voices.map(v => ({ name: v.name, lang: v.lang, local: v.localService })));
```

### Adding New Voice Names
If you discover new voice names on mobile devices, add them to the priority lists in `src/components/WordCards.tsx`:

```typescript
// For British voices
const britishVoiceNames = [
  "Your New Voice Name Here",
  // ... existing voices
]

// For American voices
const americanVoiceNames = [
  "Your New Voice Name Here",
  // ... existing voices
]
```

## Known Issues

1. **iOS Safari**: Voices may not be available on first page load
   - **Solution**: User must interact with page first (click any button)
   
2. **Android WebView**: Some devices may have no voices installed
   - **Solution**: User must install TTS engine from Play Store

3. **Private/Incognito Mode**: Some browsers restrict TTS in private browsing
   - **Solution**: Use normal browsing mode

## Future Improvements

- [ ] Add voice caching to remember user's preferred voices
- [ ] Implement audio file fallback for devices without TTS
- [ ] Add voice quality detection (prefer natural/neural voices)
- [ ] Allow users to select their preferred voice from available options
- [ ] Add voice speed and pitch controls

## Resources

- [MDN Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Can I Use: Speech Synthesis](https://caniuse.com/speech-synthesis)
- [iOS Voice List](https://support.apple.com/guide/iphone/change-siri-settings-iph83bfec8d7/ios)
- [Android TTS Engines](https://play.google.com/store/apps/details?id=com.google.android.tts)
