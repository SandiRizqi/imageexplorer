# Install dependencies
FROM node:18-alpine AS builder

#  ini akan menyimpan nilai env saat build, bukan runtime
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_MAIN_COLOR=${NEXT_PUBLIC_MAIN_COLOR}
ENV NEXT_PUBLIC_HOST=${NEXT_PUBLIC_HOST}
ENV NEXT_PUBLIC_VERSION=${NEXT_PUBLIC_VERSION}

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