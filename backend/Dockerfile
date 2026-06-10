FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["sh", "-c", "npx prisma generate && mkdir -p dist/src/generated && cp -r src/generated/prisma dist/src/generated/prisma && npm start"]