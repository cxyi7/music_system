<template>
  <div>
    <video-player
      class="video-player vjs-theme-forest"
      poster="/images/example/4.jpg"
      crossorigin="anonymous"
      playsinline
      controls
      liveui
      :sources="[videoSource]"
      :volume="0.6"
      :height="320"
      :control-bar="{
        progressControl: false,
        currentTimeDisplay: false,
        remainingTimeDisplay: false,
      }"
      :html5="{
        vhs: {
          // https://github.com/videojs/http-streaming#options
          overrideNative: !isSafari,
          maxPlaylistRetries: Infinity,
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false,
      }"
      @mounted="handleMounted"
      @ready="handleReady"
    />
  </div>
</template>
<script>
import { VideoPlayer } from '@videojs-player/vue';
import 'video.js/dist/video-js.css';

export default {
  name: 'SingerList',
  components: {
    VideoPlayer,
  },
};
</script>
<script setup>
const videoSource = {
  src: 'http://szmusk.com:6604/hls/1_053810789322_0_1.m3u8?JSESSIONID=219438463fc84285a8a72fb0d4632f77',
  type: 'application/x-mpegURL',
};

const player = shallowRef();
const handleMounted = (payload) => {
  player.value = payload.player;
  console.log('HLS Live player mounted', payload);
};

const handleReady = () => {
  // https://github.com/videojs/http-streaming#vhsxhr
  const { vhs } = player.value?.tech();
  vhs.xhr.beforeRequest = (options) => {
    // console.log('vhs.xhr.beforeRequest', options)
    // do something...
    return options;
  };
};
</script>
