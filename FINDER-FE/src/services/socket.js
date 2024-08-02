import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Sunucu URL'sini kontrol edin

export default socket;
