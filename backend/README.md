### To run:

First, create your database manually:

```bash
CREATE DATABASE your_database_name;
```

Set your `.env` file with your MySQL/Docker MySQL vars, example:

```text
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=stagen

JWT_SECRET=segredo123
```

Every time you run `npm run dev` it automatically checks for new migrations and execute them.
