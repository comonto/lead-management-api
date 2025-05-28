# Crea la directory del progetto e navigaci all'interno
mkdir lead-management-api
cd lead-management-api
#
# Inizializza il progetto Node.js
npm init -y

# Installa TypeScript e ts-node (per eseguire file TS direttamente)
npm install typescript ts-node @types/node --save-dev

# Inizializza il file tsconfig.json
npx tsc --init

# Dipendenze principali
npm install express typeorm pg reflect-metadata dotenv

# Dipendenze per la validazione
npm install class-validator class-transformer

# Dipendenze di sviluppo (tipi TypeScript)
npm install @types/express @types/pg @types/class-validator @types/class-transformer --save-dev

#
# Configurazione degli Integration Test
## Installazione delle Dipendenze
npm install jest supertest @types/jest @types/supertest ts-jest --save-dev
- jest: Il framework di test più popolare per JavaScript/TypeScript.
- supertest: Un'utility di testing HTTP che ti permette di fare richieste alla tua API come se fosse in esecuzione, senza doverla avviare su una porta.
- @types/jest, @types/supertest: Tipi TypeScript per Jest e Supertest.
- ts-jest: Un preset per Jest che permette di eseguire i test scritti in TypeScript.


#
# Docker
## Per avviare il Docker Compose
docker-compose up --build (se usi podman usa il comando: podman-compose up --build)
## Per vedere i log dei tuoi servizi:
docker-compose logs -f
## Per eseguire un container dall'immagine ed entrare nella sua shell
podman run -it --entrypoint sh localhost/lead-management-api_app:latest