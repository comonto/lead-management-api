# Usa un'immagine Node.js ufficiale come base
FROM node:18-alpine

# Imposta la directory di lavoro nel container
WORKDIR /app

# Copia package.json e yarn.lock/package-lock.json e installa le dipendenze
COPY package*.json ./
# RUN npm i -g npm@latest
# RUN npm install

# Copia il codice sorgente dell'applicazione
COPY . .

# Compila l'applicazione TypeScript in JavaScript
RUN npm run build

# Aggiungi questa riga per vedere il contenuto dopo la build
RUN ls -l dist/

# Espone la porta su cui l'app girerà
EXPOSE 3000

# Comando per avviare l'applicazione compilata
CMD ["node", "dist/app.js"]