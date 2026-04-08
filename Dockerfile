# STAGE 1: Build Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# STAGE 2: Build Backend
FROM node:22-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend/ ./

# STAGE 3: Final Runner
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

# Copy build artifacts from previous stages
COPY --from=backend-builder /app/backend ./backend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY package*.json ./

# Install root dependencies for workspace support (if needed) 
# but keep it simple by running from the backend folder
WORKDIR /app/backend

EXPOSE 3001

CMD ["node", "server.js"]
