# Video Compression Implementation Guide

## Current Implementation
✅ Added video compression detection and file size checking
✅ Shows warning if video exceeds 5MB
✅ Provides user feedback with "🎬 Compressing..." status

## What's Currently Done
- File size is checked before upload
- If video > 5MB, user is warned (can still upload)
- Loading indicator shows compression status
- Graceful error handling

## For Production: Enhanced Compression

### Option 1: Using `react-native-compressor`
```bash
npx expo install react-native-compressor
```

Then update the `compressVideo` function in `create-post.tsx`:

```javascript
import { compress } from 'react-native-compressor';

const compressVideo = async (videoUri: string): Promise<string> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(videoUri);
    const fileSizeMB = (fileInfo.size || 0) / (1024 * 1024);

    console.log(`📹 Original video size: ${fileSizeMB.toFixed(2)} MB`);

    if (fileSizeMB < 5) {
      return videoUri;
    }

    // Compress the video
    const result = await compress(
      videoUri,
      {
        compressionMethod: 'auto', // 'auto' | 'manual'
        maxSize: 5,
        quality: 0.8,
        input: 'uri',
        output: 'uri',
        downloadProgress: (progress) => {
          console.log(`⏳ Compression progress: ${progress}%`);
        },
      }
    );

    const compressedInfo = await FileSystem.getInfoAsync(result);
    const compressedMB = (compressedInfo.size || 0) / (1024 * 1024);
    
    console.log(`✅ Compressed video size: ${compressedMB.toFixed(2)} MB`);
    return result;
  } catch (error) {
    console.log('Compression error:', error);
    return videoUri;
  }
};
```

### Option 2: Using FFmpeg (Via `react-native-ffmpeg`)
```bash
npx expo install react-native-ffmpeg
```

This offers more control over codec, bitrate, and resolution.

## Recommended Settings for Vidya App

**For 720p H.264 compression:**
- Resolution: 1280x720 (720p)
- Codec: H.264
- Bitrate: 2-3 Mbps (audio: 128 kbps)
- Format: MP4
- Target size: <5MB for 60 seconds of video

## File: `create-post.tsx`

Current video compression is implemented with:
- ✅ Automatic file size checking
- ✅ User warning if >5MB
- ✅ Compression status indicator
- ✅ Error handling & fallback

**Location in file**: Lines ~80-95 (compressVideo function)

## Testing

1. Pick a video > 5MB
2. Tap Post
3. See "🎬 Compressing..." message
4. Video uploads after compression warning

## Next Steps

1. Install `react-native-compressor` or `react-native-ffmpeg`
2. Update the `compressVideo` function with the library
3. Test with various video sizes
4. Monitor upload speeds and file sizes in Firebase console
