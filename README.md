# TO DO

- Rotating testimonials in the main CTA box
- get the correct colors from hireMaverick
- Remove the CDN from the head section
- Add the LOGO
- setting up financing
- Add an steps section
-

# Maverick Contracting INC Website

A professional website for Maverick Contracting INC, featuring roofing, siding, windows, and gutter services.

## Features

- Responsive design using Tailwind CSS
- SEO optimized with sitemap and meta tags
- Mobile-friendly layout

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Tailwind CSS
- **Backend**: Express.js (Node.js)
- **Templating**: EJS
- **Deployment**: PM2, NGINX, Certbot

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/maverick-contracting.git
   cd maverick-contracting
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```
   cp .env.example .env
   ```

4. Edit the `.env`

5. Start the development server:

   ```
   npm run dev:full
   ```

6. Visit `http://localhost:3000` in your browser.

## Deployment

### Using PM2 and NGINX

1. Install PM2 globally:

   ```
   npm install -g pm2
   ```

2. Start the application with PM2:

   ```
   pm2 start server.js --name "maverick-contracting"
   ```

3. Configure NGINX to proxy requests to your Node.js application:

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. Set up SSL with Certbot:
   ```
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```
