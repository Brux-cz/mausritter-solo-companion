// ============================================
// KONFIGURACE
// ============================================

const { useState, useEffect, useCallback, useRef } = React;

// --- GOOGLE DRIVE SYNC CONFIG ---
const GOOGLE_CLIENT_ID = '948855876248-acfbvk4k4ud5fmciocfk5o8qldfcdi29.apps.googleusercontent.com';
const GOOGLE_API_KEY = 'AIzaSyDorqiiGhrfkdg_fO6dqjjHsnpeioNSL-s';
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/drive.file';

// Helper funkce
const generateId = () => Math.random().toString(36).substr(2, 9);
const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const roll = (sides) => Math.floor(Math.random() * sides) + 1;
const roll2d6 = () => roll(6) + roll(6);
