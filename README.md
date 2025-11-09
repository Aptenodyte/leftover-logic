# Leftover Logic

A simple website for fridge management and automatic recipe generation from what's in your fridge!

## Screenshots
<img width="2523" height="1664" alt="image" src="https://github.com/user-attachments/assets/450f25af-0474-4577-9113-a52294737a5d" />
<img width="2230" height="798" alt="image" src="https://github.com/user-attachments/assets/b456673d-8793-4f71-b036-06ee5c997b2a" />
<img width="2305" height="1210" alt="image" src="https://github.com/user-attachments/assets/f9902913-d8ca-4c87-9bcc-e18535e04734" />
<img width="2156" height="1497" alt="image" src="https://github.com/user-attachments/assets/18eaf6ff-c14f-4bf3-977a-489fab1d90d5" />

## Progress
TODO:
- Finish backend and database setup
- NVIDIA Nemotron integration

## Setup

```bash
git clone https://github.com/Aptenodyte/leftover-logic.git
npm i -D
npx prisma db seed
```

## Development Server

The development server defaults to running on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```
