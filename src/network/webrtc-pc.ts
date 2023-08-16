import { WsCandidateType, WsMsgTypeEnum } from '@/interface-ws';

import { WebSocketClass } from './websocket';

export class WebRTCPcClass {
  peerConnection?: RTCPeerConnection;
  videoEl: HTMLVideoElement;
  ws: WebSocketClass;
  roomId: string;

  constructor({
    videoEl,
    ws,
    roomId,
  }: {
    videoEl: HTMLVideoElement;
    ws: WebSocketClass;
    roomId: string;
  }) {
    this.videoEl = videoEl;
    this.ws = ws;
    this.roomId = roomId;
    if (!window.RTCPeerConnection) {
      console.error('当前环境不支持RTCPeerConnection！');
      alert('当前环境不支持RTCPeerConnection！');
      return;
    }
    this.peerConnection = new RTCPeerConnection();

    this.peerConnection?.addEventListener('track', (event) => {
      console.warn(`pc收到track事件`, event, event.streams);
      event.streams[0].getTracks().forEach((track) => {
        console.log('pc插入track', track);
        const sender = this.peerConnection
          ?.getSenders()
          .find((sender) => sender.track === track);
        if (!sender) {
          this.peerConnection?.addTrack(track, event.streams[0]);
        }
      });
      this.videoEl.srcObject = event.streams[0];
    });

    this.peerConnection?.addEventListener('icecandidate', (event) => {
      console.warn(`pc收到icecandidate事件`, event, event.candidate);
      if (event.candidate) {
        console.warn('发送candidate');
        this.ws.send<WsCandidateType['data']>({
          msgType: WsMsgTypeEnum.candidate,
          data: {
            candidate: event.candidate,
            room_id: this.roomId,
          },
        });
      } else {
        console.warn('没有候选者了');
      }
    });
  }

  createAnswer = async () => {
    try {
      const answer = await this.peerConnection?.createAnswer();
      console.log('createAnswer成功');
      return answer;
    } catch (error) {
      console.error('createAnswer错误');
      console.log(error);
    }
  };

  createOffer = async () => {
    try {
      const offer = await this.peerConnection?.createOffer();
      console.log('createOffer成功');
      return offer;
    } catch (error) {
      console.error('createOffer错误');
      console.log(error);
    }
  };

  addIceCandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      await this.peerConnection?.addIceCandidate(candidate);
      console.log('addIceCandidate成功');
    } catch (error) {
      console.error('addIceCandidate错误');
      console.log(error);
    }
  };

  setLocalDescription = async (sdp: RTCLocalSessionDescriptionInit) => {
    try {
      await this.peerConnection?.setLocalDescription(sdp);
      console.log('setLocalDescription成功');
    } catch (error) {
      console.error('setLocalDescription错误');
      console.log(error);
    }
  };

  setRemoteDescription = async (sdp: RTCSessionDescriptionInit) => {
    try {
      await this.peerConnection?.setRemoteDescription(sdp);
      console.log('setRemoteDescription成功');
    } catch (error) {
      console.error('setRemoteDescription错误');
      console.log(error);
    }
  };
}
