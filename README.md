Pisana na kolanie symulacja egzaminu na prawo jazdy kat b.

Wszystkie pytania i wizualizacje do nich pochodzą [stąd](https://www.gov.pl/web/infrastruktura/prawo-jazdy)

Pytania zostały posortowane po punktacji i kazde z nich ma przypisany unikatowy identyfikator znajdują się w [tym](./PrawoB.json) pliku

Wszystkie wizualizacje do pytań zostały skompresowane i umieszczone w sqlitowej bazie dany o modelu określonym [tutaj](./prawoKatBDB.prisma). 
Baza danych jest dostępna pod [tym](https://drive.google.com/uc?id=1Y0OiTnh9TbskOMZEMi71ygGAqk3EuspY&export=download) linkiem.

Żeby zbuildować lokalnie ze źródła:
npm install -> npx prisma generate --schema=./prawoKatBDB.prisma -> npm run make

Baza danych ma 3,4 GB i jest pobierana automatycznie po uruchomieniu programu.
