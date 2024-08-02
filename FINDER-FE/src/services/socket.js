import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Sunucu URL'sini kontrol edin

export default socket;
