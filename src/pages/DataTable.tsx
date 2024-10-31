import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling']
});

function DataTable() {
  const [data, setData] = useState({});

  useEffect(() => {
    console.log('Connecting to WebSocket...');
  
    // Mendengarkan pembaruan data dari server
    const handleDataUpdate = (newData) => {
      console.log('Data received from server:', newData); // Log data yang diterima
      setData(newData);
    };
  
    socket.on('connect', () => {
      console.log('Connected to WebSocket server:', socket.id); // Log saat berhasil connect
    });
  
    socket.on('data_update', handleDataUpdate);
  
    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  
    // Membersihkan listener ketika komponen dilepas
    return () => {
      socket.off('data_update', handleDataUpdate);
      console.log('Cleaned up socket listeners');
    };
  }, []);  

  return (
    <div className='prose'>
      <h1>Try Get Data From Server</h1>
      <p>Data is stored in the console log temporarily. Check console for details.</p>
    </div>
  );
}

export default DataTable;
