# backend/Dockerfile - Node 20 + dumb-init for production
FROM node:20-alpine

RUN apk add --no-cache dumb-init

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN addgroup -S nodejs && adduser -S -G nodejs -u 1001 nodejs \
  && chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
