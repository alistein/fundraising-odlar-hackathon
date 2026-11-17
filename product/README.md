# Təsdiqlənmiş ianə — verified medical fundraising (MVP)

OYU CyberAI Hackathon 2026. Demo only: mock auth, test payments, synthetic data.

## Run locally

```bash
cp .env.example .env.local   # set DATABASE_URL, and FILE_ENCRYPTION_KEY via: openssl rand -base64 32
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev
```

Switch demo role (organiser / clinic / donor) from the dropdown in the header.

Docs: `../wiki/product/architecture.md`.
