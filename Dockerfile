# Install dependencies
FROM node:18-alpine AS builder



WORKDIR /app
COPY . .

# Inject environment variables into .env.local
RUN echo "NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}" >> .env.local && \
    echo "NEXT_PUBLIC_MAIN_COLOR=${NEXT_PUBLIC_MAIN_COLOR}" >> .env.local && \
    echo "NEXT_PUBLIC_HOST=${NEXT_PUBLIC_HOST}" >> .env.local && \
    echo "NEXT_PUBLIC_VERSION=${NEXT_PUBLIC_VERSION}" >> .env.local

    
RUN npm install
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
ENV PORT 3000
CMD ["npm", "start"]