# Warehouse Manager

Playable Link: https://dyminer.github.io/Shift-Manager/game.html

A browser-based warehouse operations game inspired by the realities of working in fast-paced fulfillment environments.

Built by Dylan Miner, this project simulates the daily challenge of keeping orders moving through a warehouse while managing staffing, equipment, hiring, and operational bottlenecks.

## Overview

Warehouse Manager puts you in charge of a small fulfillment operation. Each day, new orders arrive, workers move through the flow of receiving, storage, picking, packing, and shipping, and your job is to keep the process efficient enough to turn a profit.

The game blends simple management mechanics with a light progression system inspired by real workplace learning: discover worker traits, buy zone upgrades, unlock visibility into candidate abilities, and improve throughput over time.

## Features

- 5-stage warehouse workflow:
  - Receiving
  - Storage
  - Picking
  - Packing
  - Shipping
- Daily order generation and throughput simulation
- Worker assignment by zone with drag-and-drop and dropdown controls
- Capacity upgrades for each warehouse area
- Equipment shop with zone-based bonuses
- Weekly hiring draft for new employees
- Trait discovery and tribal knowledge progression
- Cash and operational tracking via a live dashboard
- Local browser save state using localStorage

## How to play

1. Open the project in a browser.
2. Start each day to advance the warehouse cycle.
3. Assign workers to the correct stations.
4. Upgrade employee capacity and buy equipment as needed.
5. Hire stronger candidates during the weekly draft.
6. Balance throughput against staffing and costs to keep the operation profitable.

## Run it locally

Since this is a static web game, there is no install step required.

You can either:

- open `game.html` directly in a browser, or
- run a simple local web server:

```bash
cd "c:\Main\Shift-Manager"
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000/game.html
```

## Project files

- `main.js` — main game startup and UI wiring
- `simulation.js` — daily cycle and order movement logic
- `workers.js` — worker assignment and movement
- `recruitment.js` — hiring draft and candidate generation
- `equipment.js` — warehouse zones, capacity, and equipment bonuses
- `progression.js` — tribal knowledge and unlock progression
- `ui.js` — dashboard and modal rendering
- `orders.js` — order lifecycle and capacity logic
- `gameState.js` — persistent game state
- `main.css` — styling and layout

## Notes

This project is a prototype and a personal game inspired by the everyday logistics grind of warehouse work: throughput pressure, staffing constraints, equipment bottlenecks, and the constant push to improve operations without burning out your team.

It is designed to be lightweight, playable in-browser, and easy to extend with new systems, events, and mechanics.