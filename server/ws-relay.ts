import { WebSocketServer, WebSocket } from 'ws';

const PORT = parseInt(process.env.PORT || '8080', 10);
const wss = new WebSocketServer({ port: PORT });

const rooms = new Map<string, Set<WebSocket>>();

wss.on('connection', (ws) => {
    let currentRoom: string | null = null;

    ws.on('message', (raw) => {
        try {
            const msg = JSON.parse(raw.toString());

            if (msg.type === 'join') {
                const room = msg.room || 'default';
                if (currentRoom && rooms.has(currentRoom)) {
                    rooms.get(currentRoom)!.delete(ws);
                }
                currentRoom = room;
                if (!rooms.has(room)) rooms.set(room, new Set());
                rooms.get(room)!.add(ws);
                ws.send(JSON.stringify({ type: 'joined', room }));
                return;
            }

            if (currentRoom && rooms.has(currentRoom)) {
                const peers = rooms.get(currentRoom)!;
                const payload = JSON.stringify(msg);
                for (const peer of peers) {
                    if (peer !== ws && peer.readyState === WebSocket.OPEN) {
                        peer.send(payload);
                    }
                }
            }
        } catch {
            // ignore malformed messages
        }
    });

    ws.on('close', () => {
        if (currentRoom && rooms.has(currentRoom)) {
            rooms.get(currentRoom)!.delete(ws);
            if (rooms.get(currentRoom)!.size === 0) {
                rooms.delete(currentRoom);
            }
        }
    });
});

console.log(`WebSocket relay listening on port ${PORT}`);
