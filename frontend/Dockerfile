# Dockerfile simplificado para Render con Docker
FROM node:18-alpine

WORKDIR /app

# Install dependencies (including dev dependencies for build)
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Set build-time environment variables (Render will inject these)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WHATSAPP_NUMBER
ARG NEXT_PUBLIC_APP_NAME

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

# Build the application with verbose output
RUN npm run build:production

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]