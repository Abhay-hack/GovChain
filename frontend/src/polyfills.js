// frontend/src/polyfills.js
import { Buffer } from 'buffer';
import process from 'process';

window.Buffer = window.Buffer || Buffer;
window.process = window.process || process;

console.log('Polyfills loaded, Buffer defined:', typeof Buffer !== 'undefined');
console.log('Polyfills loaded, process defined:', typeof process !== 'undefined');