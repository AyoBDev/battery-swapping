type MessageHandler = (data: unknown) => void;
type StatusHandler = (status: 'connected' | 'disconnected' | 'connecting') => void;

interface WebSocketClient {
    send: (data: unknown) => void;
    close: () => void;
    onMessage: (handler: MessageHandler) => void;
    onStatus: (handler: StatusHandler) => void;
    getStatus: () => 'connected' | 'disconnected' | 'connecting';
}

export function createWebSocketClient(url: string): WebSocketClient {
    let ws: WebSocket | null = null;
    let status: 'connected' | 'disconnected' | 'connecting' = 'disconnected';
    let messageHandlers: MessageHandler[] = [];
    let statusHandlers: StatusHandler[] = [];
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const baseDelay = 1000;

    function setStatus(newStatus: typeof status) {
        status = newStatus;
        statusHandlers.forEach(h => h(status));
    }

    function connect() {
        if (ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING) {
            return;
        }

        setStatus('connecting');

        try {
            ws = new WebSocket(url);
        } catch {
            setStatus('disconnected');
            scheduleReconnect();
            return;
        }

        ws.onopen = () => {
            reconnectAttempts = 0;
            setStatus('connected');
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                messageHandlers.forEach(h => h(data));
            } catch {
                // ignore malformed messages
            }
        };

        ws.onclose = () => {
            setStatus('disconnected');
            scheduleReconnect();
        };

        ws.onerror = () => {
            ws?.close();
        };
    }

    function scheduleReconnect() {
        if (reconnectAttempts >= maxReconnectAttempts) return;
        if (reconnectTimer) clearTimeout(reconnectTimer);

        const delay = baseDelay * Math.pow(2, reconnectAttempts);
        reconnectAttempts++;

        reconnectTimer = setTimeout(connect, delay);
    }

    connect();

    return {
        send(data: unknown) {
            if (ws?.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(data));
            }
        },

        close() {
            if (reconnectTimer) clearTimeout(reconnectTimer);
            reconnectAttempts = maxReconnectAttempts;
            ws?.close();
            messageHandlers = [];
            statusHandlers = [];
        },

        onMessage(handler: MessageHandler) {
            messageHandlers.push(handler);
        },

        onStatus(handler: StatusHandler) {
            statusHandlers.push(handler);
            handler(status);
        },

        getStatus() {
            return status;
        },
    };
}
