# Install dependencies
FROM node:18-alpine AS builder


ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_MAIN_COLOR
ARG NEXT_PUBLIC_HOST
ARG NEXT_PUBLIC_VERSION




WORKDIR /app
COPY . .

# Inject environment variables into .env.local
RUN echo "NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}" >> .env.production && \
    echo "NEXT_PUBLIC_MAIN_COLOR=${NEXT_PUBLIC_MAIN_COLOR}" >> .env.production && \
    echo "NEXT_PUBLIC_HOST=${NEXT_PUBLIC_HOST}" >> .env.production && \
    echo "NEXT_PUBLIC_VERSION=${NEXT_PUBLIC_VERSION}" >> .env.production

    
RUN npm install
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
ENV PORT 3000
CMD ["npm", "start"]