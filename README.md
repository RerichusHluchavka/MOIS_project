# MOIS Projekt

## Členové týmu
Radim Kopřiva

Jaromír Bobek

Erika Blažeková

## SETUP Dockeru
pomocí `docker-compose up --build` nastartování dockeru + vypisování v příkazové řádce zprávy

pomocí `docker-compose up --build -d` se nastartuje docker a bude běžet na pozadí

## Přístup do databází

Prisoners: `docker exec -it projekt-prisoner-db-1 psql -U admin -d prisoner_db`

Kitchen: `docker exec -it projekt-kitchen-db-1 psql -U admin -d kitchen_db`

Inventory: `docker exec -it projekt-inventory-db-1 psql -U admin -d inventory_db`

Authorizaci: `docker exec -it projekt-auth-db-1 psql -U admin -d auth_db`

### Exportované databáze jsou v rootu:
- prisoner_export.sql
- kitchen_export.sql
- inventory_export.sql
- auth_export.sql

## Imoprtování databází
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