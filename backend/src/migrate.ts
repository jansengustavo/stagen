import { Umzug } from "umzug";
import path from "path";
import fs from "fs/promises";
import pool from "./config/database";

const migrationsDir = path.resolve(__dirname, "migrations");

export const umzug = new Umzug({
  migrations: {
    glob: ["*.up.sql", { cwd: migrationsDir }],
    resolve: ({ path: filePath, name }) => {
      if (!filePath) throw new Error(`Migration missing path: ${name}`);
      const match = name.match(/^(\d+_.+)\.up\.sql$/);
      if (!match) throw new Error(`Invalid migration file: ${name}`);
      return {
        name: match[1] as string,
        path: filePath,
        up: () => fs.readFile(filePath, "utf8").then((sql) => pool.query(sql)),
      };
    },
  },

  storage: {
    executed: async () => {
      await pool.query(
        "CREATE TABLE IF NOT EXISTS migrations (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, run_on DATETIME NOT NULL)",
      );
      const [rows] = await pool.query<any[]>(
        "SELECT name FROM migrations ORDER BY name",
      );
      return rows.map((r) => r.name as string);
    },
    logMigration: async ({ name }) => {
      await pool.query(
        "INSERT INTO migrations (name, run_on) VALUES (?, NOW())",
        [name],
      );
    },
    unlogMigration: async ({ name }) => {
      await pool.query("DELETE FROM migrations WHERE name = ?", [name]);
    },
  },

  logger: console,
  context: pool,
});

if (require.main === module) {
  umzug
    .runAsCLI()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
