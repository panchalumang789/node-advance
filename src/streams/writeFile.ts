import { Duplex, Writable } from 'stream'

export const writableStream = new Writable({
    write(chunk, encoding, callback) {
        console.log(`Received chunk: ${chunk.toString()}`);
        callback();
    }
});

export const duplexStream = new Duplex({
    write(chunk, encoding, callback) {
        console.log(`Received chunk: ${chunk.toString()}`);
        callback();
    },
    read() {
        const data = `Hello, world! ${Math.random()}\n`;
        this.push(data);
    }
});


