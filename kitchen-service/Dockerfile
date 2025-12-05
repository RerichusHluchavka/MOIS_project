FROM node:25-alpine

WORKDIR /app

# Kopíruj package soubory
COPY package*.json ./

# Instalace závislostí
RUN npm install

# Kopíruj zdrojový kód
COPY . .

# Expose portu
EXPOSE 3003

# Příkaz pro spuštění
CMD ["npm", "start"]