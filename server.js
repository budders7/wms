import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { client, connectToDatabase } from "./db.js"; // Import the database connection

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to the database
connectToDatabase();

// CREATE
app.post("/api/add-product", async (req, res) => {
  try {
    const { sku, name, description, description_alt, upc, color, size } =
      req.body;

    if (!name || !description || !sku) {
      return res
        .status(400)
        .json({ error: "Name, SKU, and quantity are required." });
    }
    const result = await client.query(
      "INSERT INTO products (sku, name, description, description_alt, upc, color, size) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [sku, name, description, description_alt, upc, color, size]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the item." });
  }
});

// READ
app.get("/api/products", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching items." });
  }
});

// UPDATE
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const result = await client.query(
      "UPDATE items SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    if (result.rowCount > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the item." });
  }
});

// DELETE
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.query("DELETE FROM items WHERE id = $1", [id]);
    if (result.rowCount > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the item." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
