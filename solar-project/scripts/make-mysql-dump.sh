DATABASE_NAME=solar_project

rm artifacts/$DATABASE_NAME.zip;

mysqldump -u root $DATABASE_NAME > artifacts/$DATABASE_NAME.sql

cd artifacts;

zip $DATABASE_NAME.zip $DATABASE_NAME.sql

rm $DATABASE_NAME.sql;