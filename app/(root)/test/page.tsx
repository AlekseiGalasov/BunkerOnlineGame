"use client";

import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [input, setInput] = useState("");
    const [roomId, setRoomId] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.connect()
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("lobby-data", (lobby) => {
            console.log(lobby)
        });

        socket.on("send-message", (value) => {
            console.log(value)
            setMessages(prev => [...prev, value])
        });

        return () => {
            socket.off("connect", onConnect);
            socket.off("lobby-data");
            socket.off("disconnect", onDisconnect);
        };
    }, []);


    const handleDisconnect = () => {
        socket.disconnect()
    }

    const handleConnect = () => {
        socket.connect()
    }

    const sendMessage = () => {
        socket.emit("send-message", input);
        setInput('')
    }

    const getLobby = () => {
        socket.emit("get-lobby");
    }


    return (
        <div>
            <p>Status: { isConnected ? "connected" : "disconnected" }</p>
            <p>Transport: { transport }</p>
            <p>Room Id: {roomId}</p>
            <button className='primary-text-gradient' onClick={handleDisconnect}>Disconnect</button>
            <button className='primary-text-gradient' onClick={handleConnect}>Connect</button>
            <Input value={roomId} onChange={(e) => setRoomId(e.target.value)} />
            <Button onClick={sendMessage}>Create room</Button>
            <Input value={input} onChange={(e) => setInput(e.target.value)} />
            <Button onClick={sendMessage}>Send message</Button>
            <Button onClick={getLobby}>get lobby</Button>
            {messages.length > 0  && messages.map(msg => (
                <div>{msg}</div>
            ))}
        </div>
    );
}