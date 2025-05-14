# Install dependencies
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
ENV PORT 3000
CMD ["npm", "start"]