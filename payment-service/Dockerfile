FROM node:25-alpine

# Nastavíme pracovní adresář uvnitř kontejneru
WORKDIR /app

# Zkopírujeme package.json a nainstalujeme závislosti
COPY package*.json ./

RUN npm install

# Zkopírujeme zbytek kódu aplikace
COPY . .

# Kontejner poslouchá na portu 8080 (nebo jiném, který si zvolíte)
EXPOSE 3005

CMD [ "npm", "start" ]