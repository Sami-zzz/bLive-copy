import axios from 'axios';

// http://localhost:1985/
export const fetchRtcV1Publish = (sdp: string) => {
  return axios.post('/srs/rtc/v1/publish/', {
    api: '/rtc/v1/publish/',
    streamurl: 'webrtc://localhost/billd/ttt',
    // streamurl: 'rtmp://localhost:1935/billd/ccc',
    sdp,
    // tid: +new Date(),
    // clientip: null,
  });
};
