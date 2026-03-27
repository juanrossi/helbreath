import * as protobuf from 'protobufjs/minimal';

type MessageCallback = (msgType: number, data: Uint8Array) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessage: MessageCallback;
  private onConnected: (() => void) | null = null;
  private onDisconnected: (() => void) | null = null;
  private reconnectTimer: number | null = null;

  constructor(url: string, onMessage: MessageCallback) {
    this.url = url;
    this.onMessage = onMessage;
  }

  connect(): void {
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = 'arraybuffer';

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.onConnected?.();
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.onDisconnected?.();
      this.scheduleReconnect();
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    this.ws.onmessage = (event: MessageEvent) => {
      const data = new Uint8Array(event.data as ArrayBuffer);
      if (data.length < 1) return;
      this.onMessage(data[0], data.slice(1));
    };
  }

  send(msgType: number, payload: Uint8Array): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected');
      return;
    }
    const data = new Uint8Array(1 + payload.length);
    data[0] = msgType;
    data.set(payload, 1);
    this.ws.send(data.buffer);
  }

  setOnConnected(cb: () => void): void {
    this.onConnected = cb;
  }

  setOnDisconnected(cb: () => void): void {
    this.onDisconnected = cb;
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws?.close();
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      console.log('Reconnecting...');
      this.connect();
    }, 3000);
  }
}
