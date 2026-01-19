# Kove Media Landing Page

Professional landing page for US contractors - built with Next.js and Tailwind CSS.

## Features

- Modern, responsive design optimized for contractors
- Mobile-first approach
- Form submission with email integration
- Meta Pixel tracking integration
- Professional design with red color scheme (Kove Media branding)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
npm start
```

## Environment Variables

Make sure to set up your email credentials in Vercel environment variables:
- `EMAIL_USER` - Your email address
- `EMAIL_PASS` - Your email password or app password

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS 3
- Meta Pixel (Facebook Pixel)

## Project Structure

- `pages/index.js` - Main landing page
- `pages/_app.js` - App wrapper with global styles
- `styles/globals.css` - Global Tailwind CSS styles
- `api/send-email.js` - Email sending API endpoint
- `tailwind.config.js` - Tailwind configuration

