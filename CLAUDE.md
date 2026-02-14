# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Offline-first, browser-based AI learning platform that runs LLM inference locally on student devices via WebGPU/WASM. No cloud AI costs — the server only handles lightweight collaboration sync.

**Status:** Pre-implementation (PRD phase). See README.md for the full product requirements document.

## Architecture

```
Student Device (Browser/PWA)
├── WebGPU/WASM AI Runtime (7B param model, ~1-2GB quantized)
├── IndexedDB (documents, model cache, embeddings)
├── Vector embeddings (all-MiniLM-L6-v2, 22MB)
└── Service Worker (offline support)
        ↕ Optional sync only
Lightweight Sync Server
├── Node.js + WebSocket
├── Yjs CRDT state sync
├── PostgreSQL (metadata only, no AI chat logs)
└── S3 (shared resources)
```

**Key constraint:** AI inference is 100% client-side. The server never processes AI queries. This is core to the privacy, cost, and offline-first guarantees.

## Planned Tech Stack

- **Frontend:** React 18+ with Suspense, PWA (Service Worker + manifest)
- **AI Runtime:** WebGPU primary, WASM fallback, server API last resort
- **Model format:** GGUF or ONNX (INT4/INT8 quantized)
- **Candidate models:** Phi-3-mini (3.8B) or Llama 3.2-3B
- **Collaboration:** Yjs CRDT + WebSocket, optional WebRTC P2P
- **Storage:** IndexedDB for all local data
- **Backend:** Node.js, PostgreSQL, S3, Cloudflare Workers/Durable Objects

## Performance Targets

- First token latency: < 150ms
- Streaming: 20-50 tokens/sec
- Model load from cache: < 5 seconds
- Model download: < 3 min on 10Mbps
- Infrastructure cost: < $0.10/student/month

## Compliance Requirements

FERPA, COPPA, GDPR, CCPA. Student AI interactions must never be stored server-side. Analytics must be anonymized and aggregated. Users under 13 require parental consent.

## Fallback Strategy

Multi-tier degradation: WebGPU → WASM → Server API (paid tier). Progressive model loading — core model (~500MB) loads first, extended capabilities stream in background.
