# Mobile Text-to-Speech Guide

## Overview
The Sema3ny app uses a **hybrid TTS (Text-to-Speech) approach** to provide reliable American and British English pronunciation across all devices, including mobile browsers where native TTS support is inconsistent.

## Solution Architecture

### Primary Method: Google Translate TTS
- Uses HTML5 Audio with Google Translate's TTS endpoint
- **Advantages**:
  - ✅ Works on ALL mobile browsers (iOS Safari, Android Chrome, MS Edge Mobile)
  - ✅ Consistent British and American accent quality
  - ✅ No installation required
  - ✅ Faster playback response
  - ✅ Cached audio for better performance

### Fallback Method: Web Speech API
- Uses browser's native `speechSynthesis` API
- **When used**: If Google TTS fails (rare cases: no internet, blocked endpoint)
- **Advantages**: Works offline on desktop browsers with good voice support

## Mobile Browser Support

### ✅ iOS Safari
- **Primary**: Google TTS (en-GB, en-US)
- **Fallback**: Native voices (Daniel, Kate, Samantha, Alex)
- **Status**: Fully supported, no installation needed

### ✅ Android Chrome
- **Primary**: Google TTS (en-GB, en-US)
- **Fallback**: Native voices (en-gb-x-rjs-local, en-us-x-sfg-local)
- **Status**: Fully supported, no installation needed

### ✅ MS Edge Mobile
- **Primary**: Google TTS (en-GB, en-US)
- **Fallback**: Chromium-based voices
- **Status**: Fully supported, no bugs

### ✅ Desktop Browsers
- **Primary**: Google TTS (en-GB, en-US)
- **Fallback**: High-quality native voices (Microsoft, Google)
- **Status**: Excellent support with natural voices

## What We've Implemented

### 1. Hybrid TTS System
- **Primary**: HTML5 Audio + Google Translate TTS endpoint
- **Fallback**: Web Speech API with enhanced voice detection
- **Caching**: Audio elements cached in memory for repeat playback
- **Error handling**: Graceful fallback with user-friendly error messages

### 2. Smart Voice Detection (Fallback Layer)
- Mobile-specific voice names (iOS: Daniel, Kate, Samantha, Alex)
- Android-specific voice names (en-gb-x-*, en-us-x-*)
- Case-insensitive language matching
- Priority-based voice selection (natural > online > local)

### 3. User Feedback
- Visual feedback during playback (spinning animation)
- Error messages when TTS unavailable
- Console logging for debugging
- Smooth transitions between primary and fallback methods

## How It Works

### User Clicks Pronunciation Button
1. **Step 1**: Check audio cache for word + accent combination
2. **Step 2**: If cached, play immediately; if not, create new Audio element
3. **Step 3**: Set source to Google Translate TTS endpoint:
   - British: `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-GB&client=tw-ob&q=WORD`
   - American: `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-US&client=tw-ob&q=WORD`
4. **Step 4**: Play audio
5. **Step 5**: Cache audio element for future use
6. **On Error**: Fall back to native Web Speech API

### Caching Strategy
- Audio elements cached in component state (Map)
- Key format: `{word}-{accent}` (e.g., "hello-british")
- Reduces network requests for repeated words
- Improves playback speed

## Troubleshooting

### No Sound on Any Device
1. **Check volume**: Ensure device volume is up
2. **Check mute**: Ensure device is not muted
3. **Check internet**: Google TTS requires internet connection
4. **Check console**: Look for error messages in browser DevTools

### British/American Accent Issues
**This should no longer occur** with the new hybrid system, as Google TTS reliably provides both accents.

If you experience issues:
1. Check browser console for errors
2. Verify internet connection
3. Try refreshing the page
4. Clear browser cache

### MS Edge Mobile "Bugs Up"
**This has been fixed** with the new hybrid approach. Google TTS works reliably on MS Edge Mobile without requiring any device settings or installations.

## For Developers

### Architecture Overview
```
┌─────────────────────────────────────────┐
│     User clicks pronunciation button    │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│      Check audio cache (Map)            │
│   Key: {word}-{accent}                  │
└─────────────┬───────────────────────────┘
              │
        ┌─────┴──────┐
        │            │
   Cached?      Not Cached
        │            │
        ▼            ▼
    Play     Create Audio Element
              Set src to Google TTS
              Add to cache
              Play
                │
          ┌─────┴──────┐
      Success      Error
          │            │
          ▼            ▼
      Cache      Fallback to
      & Play     speechSynthesis
```

### Testing on Mobile
```javascript
// In browser console:
// 1. Test primary method (Google TTS)
const audio = new Audio('https://translate.google.com/translate_tts?ie=UTF-8&tl=en-GB&client=tw-ob&q=hello');
audio.play();

// 2. Check fallback voices
const voices = speechSynthesis.getVoices();
console.table(voices.map(v => ({ name: v.name, lang: v.lang, local: v.localService })));
```

### Key Code Locations
- **Main Component**: `src/components/WordCards.tsx`
- **Primary TTS**: `speakWord()` function - Uses HTML5 Audio + Google TTS
- **Fallback TTS**: `fallbackToSpeechSynthesis()` - Uses Web Speech API
- **Error Handler**: `showErrorMessage()` - Displays user-friendly errors
- **Cache**: `audioCache` state - Map of Audio elements

## Technical Details

### Google Translate TTS Endpoint
- **URL**: `https://translate.google.com/translate_tts`
- **Parameters**:
  - `ie=UTF-8`: Input encoding
  - `tl=en-GB` or `tl=en-US`: Target language/accent
  - `client=tw-ob`: Client identifier (text-to-speech widget)
  - `q=WORD`: Text to speak (URL-encoded)
- **Response**: MP3 audio stream
- **CORS**: Allowed for cross-origin requests
- **Rate Limiting**: Reasonable for user interactions

### Browser Compatibility
| Browser | Primary (Google TTS) | Fallback (speechSynthesis) | Status |
|---------|---------------------|---------------------------|--------|
| Chrome Desktop | ✅ | ✅ (Excellent) | Perfect |
| Chrome Mobile | ✅ | ✅ (Good) | Perfect |
| Safari Desktop | ✅ | ✅ (Excellent) | Perfect |
| Safari iOS | ✅ | ✅ (Good) | Perfect |
| Edge Desktop | ✅ | ✅ (Excellent) | Perfect |
| Edge Mobile | ✅ | ✅ (Good) | Perfect |
| Firefox Desktop | ✅ | ✅ (Good) | Perfect |
| Firefox Mobile | ✅ | ⚠️ (Limited) | Good |

## Known Limitations

1. **Internet Required**: Google TTS requires active internet connection
   - **Mitigation**: Fallback to native speechSynthesis (may work offline)
   
2. **Google TTS Unofficial**: Endpoint not officially documented
   - **Mitigation**: Widely used by millions of sites, stable for years
   - **Backup Plan**: Can switch to pre-recorded audio files if needed

3. **Cache Not Persistent**: Audio cache cleared on page reload
   - **Future**: Can implement localStorage caching for offline use

## Future Improvements

- [x] ~~Add voice caching to improve performance~~ ✅ **Implemented**
- [x] ~~Fix mobile browser compatibility~~ ✅ **Fixed**
- [x] ~~Resolve MS Edge Mobile issues~~ ✅ **Resolved**
- [ ] Add offline support with pre-recorded audio files
- [ ] Implement localStorage for persistent audio cache
- [ ] Add voice speed and pitch controls
- [ ] Allow users to toggle between Google TTS and native voices
- [ ] Add pronunciation quality feedback system

## Resources

- [MDN Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Can I Use: Speech Synthesis](https://caniuse.com/speech-synthesis)
- [iOS Voice List](https://support.apple.com/guide/iphone/change-siri-settings-iph83bfec8d7/ios)
- [Android TTS Engines](https://play.google.com/store/apps/details?id=com.google.android.tts)
