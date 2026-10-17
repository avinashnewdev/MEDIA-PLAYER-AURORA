# Native playback engine migration plan

## Status

This document records the selected native-engine direction. It is a plan, not a claim that native codec playback is already implemented. The current app is still primarily a single HTML media player wrapped by Electron and Capacitor.

## Goal

Keep Aurora's existing UI (playlist, volume/brightness controls, EQ and file selection) while moving actual media decoding/playback behind a platform-aware engine. Do not advertise “all codecs” until a real-device test matrix verifies the formats.

## Why not add the retired FFmpegKit package?

The original FFmpegKit repository is archived and its old prebuilt artifacts were removed from Maven Central. Android-only community continuations do not solve iOS and Windows playback by themselves. Adding one dependency to this project would therefore create a misleading “cross-platform” result.

## Target architecture

- **Shared UI:** keep the current HTML/CSS UI and make playback controls talk to a small PlaybackEngine adapter instead of directly assuming an HTML video element is the only backend.
- **Android:** evaluate a bundled LibVLC-based native player/bridge for broad local-file and subtitle support. Test Android 10+ scoped-storage file access and hardware-decoding fallbacks.
- **iOS:** evaluate VLCKit/libVLC integration and native document-picker access. Keep the current PWA as a separate fallback; an unsigned IPA is not a normal installable iOS release.
- **Windows:** evaluate bundling a compatible LibVLC runtime with Electron, including x64 packaging, native-library loading, and installer size. Electron's built-in media element remains a fallback for unsupported/unavailable native runtime cases.
- **Web/PWA:** retain the browser media backend; browsers do not allow shipping arbitrary native codec libraries, so codec support remains browser/device-dependent.

## Playback adapter contract

The UI should depend on a small, testable contract rather than platform APIs directly:

- open(source, options) / close()
- play() / pause() / seek(seconds)
- setVolume(0..1) / setPlaybackRate(rate)
- getState() with duration, position, playing, and error information
- events for ready, timeupdate, ended, and actionable playback errors

Brightness is a display control, not a codec feature. On platforms that don't expose system brightness to the app, keep it as a video-rendering filter and clearly distinguish it from device brightness. The 20-band EQ must only be shown as active when the selected backend actually routes audio through the EQ; a UI slider alone is not proof of audio processing.

## Required gates before enabling the engine by default

1. Confirm engine/license compatibility and include all required third-party notices. Audit LGPL/GPL components and codec patent implications before distributing binaries.
2. Prototype each platform separately and confirm local-file access works without copying large files into app storage.
3. Test common containers/codecs (MP4/H.264/AAC, MKV/H.264, HEVC/H.265, WebM/VP9/Opus, AVI, MP3, FLAC, WAV, subtitle sidecars) on actual hardware; mark unsupported combinations honestly.
4. Verify volume, seeking, rotation/fullscreen, background audio policy, subtitles, error recovery, and memory use.
5. Run Windows, Android, and iOS CI builds independently. Treat an unsigned IPA as a build artifact only, not as a signed public iOS distribution.
6. Only switch the UI to the native backend after each platform passes its test gate; retain a fallback path.

## Current limitations

- This plan does not yet add a native decoder or change the player UI.
- A successful CI build only proves packaging; it does not prove media decoding works on physical devices.
- No implementation can promise literally every codec on every device, because licensing, codec profiles, hardware capability, and platform policies vary.
