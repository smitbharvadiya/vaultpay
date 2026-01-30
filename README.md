# VaultPay  
### Unified Payment Gateway Orchestration Platform

> **One API. Multiple Payment Providers. Zero Vendor Lock-In.**

---

## 📌 Overview

**VaultPay** is a backend engineering project that provides a **single, unified REST API** to integrate and manage multiple payment providers such as **Stripe** and **Razorpay**.

The project focuses on solving real-world backend challenges that arise when working with third-party payment providers, including vendor-specific APIs, webhook handling, rate limiting, and extensibility.

---

## 🎯 Why This Project

Most applications that support payments end up tightly coupled to a single payment gateway.  
Switching or adding a new provider often requires rewriting large portions of the codebase.

This project was built to explore and demonstrate:

- How to **abstract third-party services** behind clean interfaces
- How to handle **asynchronous payment workflows** using webhooks
- How to design **extensible systems** that avoid vendor lock-in
- How to protect APIs using **distributed rate limiting**

---

## 🚩 Problem Statement

Payment gateways differ significantly in:
- API contracts and request formats
- Webhook event structures
- Error handling and retry mechanisms

Directly integrating these providers leads to:
- Duplicated gateway-specific logic
- Increased maintenance overhead
- Difficulty in adding or switching providers
- Complex and fragile webhook handling

---

## 💡 Solution: VaultPay

VaultPay acts as a **gateway-agnostic orchestration layer**.

Applications integrate with VaultPay once and gain the ability to:
- Route payments through multiple providers
- Add or switch gateways without changing application logic
- Process all payment events through a **normalized event model**
- Monitor payment activity from a centralized interface

---

## 🔁 High-Level Flow

1. A client application sends a payment request to VaultPay via a unified REST API.
2. VaultPay selects the appropriate payment provider.
3. The request is forwarded using a provider-specific adapter.
4. Asynchronous webhook events are received and normalized.
5. VaultPay updates internal payment state and exposes results via APIs.

---

## ✨ Core Features

### 🔗 Unified Payment API
- Single REST API for initiating and managing payments
- Gateway-agnostic request and response structure
- Removes direct dependency on provider SDKs

---

### 🧩 Provider-Agnostic Adapter Architecture
- Each payment gateway is isolated behind a common interface
- New providers can be added without modifying core business logic
- Ensures backward compatibility with existing integrations

---

### 🔄 Webhook Normalization & Event Handling
- Centralized webhook ingestion for all providers
- Converts provider-specific payloads into a unified internal event format
- Simplifies asynchronous payment state management (success, failure, refunds)

---

### 🔐 Secure Access & Rate Limiting
- API key–based authentication for external consumers
- JWT-secured authentication for dashboard users
- Redis-backed distributed rate limiting using TTL-based counters
- Protects APIs from abuse while sustaining high-throughput traffic

---

### 📊 Observability & Analytics
- Centralized transaction history
- Improves debugging, monitoring, and operational insight

---

## 🛠️ Tech Stack

- **Backend:** Node.js, TypeScript, Express.js  
- **Databases:** MongoDB, Redis  
- **Frontend:** React.js
- **APIs:** REST


## 📈 Impact & Outcomes

VaultPay highlights how payment integrations can be simplified by:
- Reducing gateway-specific integration logic
- Enabling faster onboarding of new payment providers
- Improving reliability of asynchronous payment handling
- Encouraging clean system boundaries and extensibility

## 🔮 Future Enhancements

- Automated gateway fallback and retry strategies
- Payment reconciliation and reporting
- Improved webhook retry and failure handling
- Support for additional payment providers

## 🔗 Links

- 🌐 Live Demo: https://vaultpay-one.vercel.app/
