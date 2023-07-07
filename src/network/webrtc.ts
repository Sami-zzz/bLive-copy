export class WebRTCClass {
  peerConnection?: RTCPeerConnection;
  videoEl?: HTMLVideoElement;
  // sender?: RTCRtpTransceiver;

  constructor({ videoEl }: { videoEl: HTMLVideoElement }) {
    this.videoEl = videoEl;
    if (!window.RTCPeerConnection) {
      console.error('当前环境不支持RTCPeerConnection！');
      alert('当前环境不支持RTCPeerConnection！');
      return;
    }
    this.peerConnection = new RTCPeerConnection();
    this.peerConnection?.addEventListener('addstream', (event: any) => {
      console.warn(`pc收到addstream事件`, event, event.stream);
      this.addStream(event.stream);
    });
    this.peerConnection?.addEventListener('addtrack', (event: any) => {
      console.warn(`pc收到addtrack事件`, event, event.stream);
      this.addStream(event.stream);
    });
  }

  createOffer = async () => {
    try {
      const sdp = await this.peerConnection?.createOffer();
      return sdp;
    } catch (error) {
      console.error('createOffer错误');
      console.log(error);
    }
  };

  setLocalDescription = async (desc) => {
    try {
      await this.peerConnection?.setLocalDescription(desc);
    } catch (error) {
      console.error('setLocalDescription错误');
      console.log(error);
    }
  };

  setRemoteDescription = async (desc) => {
    try {
      await this.peerConnection?.setRemoteDescription(
        new RTCSessionDescription(desc)
      );
    } catch (error) {
      console.error('setRemoteDescription错误');
      console.log(error);
    }
  };

  addTransceiver = ({ track, stream, direction }) => {
    console.warn('addTransceiver', track, stream, direction);
    this.peerConnection?.addTransceiver(track, {
      streams: [stream],
      direction,
    });
  };

  addStream = (stream) => {
    if (!this.peerConnection) return;
    console.log('addStream', this.videoEl, stream);
    this.videoEl!.srcObject = stream;
  };
}
