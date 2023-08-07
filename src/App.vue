<template>
  <div>
    <h1>websocket测试</h1>
    <h2>当前SocketId：{{ ws?.socket.id }}</h2>
    <button @click="handleSendOffer">offer</button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { WebSocketClass } from '@/network/websocket';

const ws = ref<WebSocketClass>();

function init() {
  ws.value = new WebSocketClass();
  ws.value.socket.on('connect', () => {
    console.log('connect成功', ws.value?.socket.id);
    initReceive();
  });
}

onMounted(() => {
  init();
});

function initReceive() {
  ws.value?.socket.on('offer', (data) => {
    console.log('收到offer', data);
  });
  ws.value?.socket.on('answer', (data) => {
    console.log('收到answer', data);
  });
  ws.value?.socket.on('joined', (data) => {
    console.log('收到joined', data);
  });
  ws.value?.socket.on('message', (data) => {
    console.log('收到message', data);
  });
}

function handleSendOffer() {
  ws.value?.send({ msgType: 'offer', data: { sdp: 123 } });
}
</script>

<style lang="scss" scoped></style>
