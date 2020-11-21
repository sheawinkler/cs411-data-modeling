# Solar Project


## Getting start

### Set up MYSQL

1. Make changes to the `.env.dev`
1. Create a database name 'solar_project'

```
mysql -u {USERNAME} -p # This will bring you into the MySQL shell prompt. Next, create a new database with the following command
  mysql> CREATE DATABASE solar_project;
  mysql> exit;
```

2. unzip the `./artifacts/solar_project.zip`
3. Run `mysql -u {USERNAME} -p solar_project < ./artifacts/solar_project.sql`
