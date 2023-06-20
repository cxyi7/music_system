<template>
  <div>
    <video ref="video" autoplay muted></video>
  </div>
</template>
<script>
export default {
  name: 'RecommendList',
};
</script>
<script setup>
const video = ref(null);

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    console.log(stream);
    video.vlaue.srcObj = stream;
    console.log(stream);
  })
  .catch((error) => console.log('navigator.getUserMedia error: ', error));
</script>
