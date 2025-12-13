# MOIS Projekt

## Členové týmu
Radim Kopřiva

Jaromír Bobek

Erika Blažeková

## SETUP Dockeru
pomocí `docker-compose up --build` nastartování dockeru + vypisování v příkazové řádce zprávy

pomocí `docker-compose up --build -d` se nastartuje docker a bude běžet na pozadí

## Přístup do databází

Mely by byt spusteny automaticky skrz `docker-compose up`

### SQL queries z exportovaných databází jsou v rootu:
- prisoner_data.sql
- kitchen_data.sql
- inventory_data.sql
- auth_data.sql

## Importování databází
Nezkoušel jsem ale mělo by být pomocí:

`docker exec -i <container_name> psql -U <username> -d <database_name> < backup.sql`

Konkrétní příklad:

`docker exec -i <projekt-prisoner-db-1> psql -U admin -d prisoner_db < prisoner_export.sql`


## TODO backednu (co chybí)

- komunikace mezi mikroslužbami (bude asi pomocí REST)
- připojení něčeho externího (asi platební brána)

## API gateway

Přístup k jednotlivým servisám zajišťuje API gateway 
 `http://localhost/api/`

 K jednotlivím mikroservisám se pak lze dostat pomocí přídání názvu mikroservisy (auth, prison, inventory, kitchen)

 Příklady dotazů:
- `http://localhost/api/auth/login`
- `http://localhost/api/kitchen/ingredients`
- `http://localhost/api/inventory/storing`
- `http://localhost/api/prison/prisoners`