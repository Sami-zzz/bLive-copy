<template>
  <div class="app-wrap">
    <video
      id="myVideo"
      ref="videoRef"
      muted
      autoplay
    ></video>
    <video
      id="pullVideo"
      ref="pullVideoRef"
      muted
      autoplay
    ></video>
    <!-- <button @click="getScreen">获取窗口</button> -->
    <button @click="startRTC">WebRTCClass</button>
    <button @click="playFlv">playFlv</button>
  </div>
</template>

<script lang="ts" setup>
import flvJs from 'flv.js';
import { ref } from 'vue';

import { fetchRtcV1Publish } from './api/srs';
import { WebRTCClass } from './network/webrtc';

const rtc = ref<WebRTCClass>();
const localStream = ref<MediaStream>();
const videoRef = ref<HTMLVideoElement>();
const pullVideoRef = ref<HTMLVideoElement>();

function playFlv() {
  const flvPlayer = flvJs.createPlayer({
    type: 'flv',
    url: 'http://localhost:5001/billd/ttt.flv',
  });
  console.log('123');
  flvPlayer.attachMediaElement(pullVideoRef.value!);
  flvPlayer.load();
}

async function getScreen() {
  const event = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });
  // 视频轨、音频轨
  // const audio = event.getAudioTracks();
  // const video = event.getVideoTracks();
  console.log('getDisplayMedia成功', event);
  localStream.value = event;
  videoRef.value!.srcObject = event;
  videoRef.value?.addEventListener('loadedmetadata', async () => {
    console.warn('视频流-loadedmetadata');
    localStream.value?.getTracks().forEach((track) => {
      rtc.value?.addTransceiver({
        track,
        stream: localStream.value,
        direction: 'sendonly',
      });
    });
    const offer = await rtc.value?.createOffer();
    console.log('offer', offer);
    if (!offer) return;
    await rtc.value?.setLocalDescription(offer);
    console.log('all done');
    const res = await fetchRtcV1Publish(offer.sdp!);
    console.log(res.data);
    rtc.value?.setRemoteDescription(
      new RTCSessionDescription({ type: 'answer', sdp: res.data.sdp })
    );
    console.log(res.data, 111);
  });
}

function startRTC() {
  const webrtc = new WebRTCClass({ videoEl: videoRef.value! });
  console.log(webrtc, 'new webrtc成功');
  rtc.value = webrtc;
  getScreen();
}
</script>

<style lang="scss" scoped>
.app-wrap {
  #myVideo {
    width: 700px;
  }
  #pullVideo {
    width: 500px;
  }
}
</style>
