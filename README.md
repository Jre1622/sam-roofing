# Sam's Roofing Website

A professional website for Sam's Roofing company, featuring roofing, siding, and gutter services. The website includes Telegram integration for instant lead notifications.

## Features

- Responsive design using Tailwind CSS
- Contact form with Telegram notifications
- SEO optimized with sitemap and meta tags
- Mobile-friendly layout

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Tailwind CSS
- **Backend**: Express.js (Node.js)
- **Templating**: EJS
- **Notifications**: Telegram Bot API
- **Deployment**: PM2, NGINX, Certbot

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Telegram Bot Token (for notifications)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/sam-roofing.git
   cd sam-roofing
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```
   cp .env.example .env
   ```

4. Edit the `.env` file with your Telegram Bot Token and Chat ID.

5. Start the development server:

   ```
   npm run dev:full
   ```

6. Visit `http://localhost:3000` in your browser.

## Setting Up Telegram Bot

1. Talk to [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot with the `/newbot` command
3. Copy the API token provided
4. Add the token to your `.env` file as `TELEGRAM_BOT_TOKEN`
5. Get your Chat ID by talking to [@userinfobot](https://t.me/userinfobot)
6. Add your Chat ID to the `.env` file as `TELEGRAM_CHAT_ID`

## Deployment

### Using PM2 and NGINX

1. Install PM2 globally:

   ```
   npm install -g pm2
   ```

2. Start the application with PM2:

   ```
   pm2 start server.js --name "sams-roofing"
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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or support, please contact [your email].
