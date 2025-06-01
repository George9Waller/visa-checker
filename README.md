# What is it?
This is a nextjs web app I created to manage visa compliance. It is deployed in Vercel and uses a postgres db hosted in heroku.

## Features
- Auth - Sign in with Google (NextAuth)
- Visa cration/management to create your visas with the conditions of travel & counties they apply to
- Calendar to view past and upcoming trips
- Trip creation to record all of your holidays. It automatically tries to select a visa relevant to the location if required. If the visa would be invalid a warning is displayed
- Visa overview page showing all the trips using the visa and calculations against the limits. This is perfect for showing at a border if asked to outline all the trips and overall calculations

## Stack
- NextJS
- Prisma


![image](https://github.com/user-attachments/assets/64a66ddc-3518-4d89-a24d-5f1bd16af3c8)


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
