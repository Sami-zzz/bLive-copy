1. getDisplayMedia 获取 stream
2. new RTCPeerConnection 得到 pc
3. 监听 pc 的 track 和 candidate 事件
4. 遍历 stream 里的 track，并插入 pc
5. 加入房间
6. pc 创建 offer，并将 offer 设置到本地描述
7. 发送 offer
   1. 接收方收到 offer 了， new RTCPeerConnection 得到 pc
   2. 将收到的 offer 设置为远程描述
   3. pc 创建 answer，并将 answer 设置到本地描述
   4. 发送 answer
8. 收到 anwser，将 anwser 设置到远程描述
9. 完成会议
