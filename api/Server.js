const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const jwt = require("jsonwebtoken");
const SECRET_KEY = "mysecretkey";
const app = express();
app.use(cors());
app.use(express.json())

// DB Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "H@ppy!2018",
    database: "e-com"
});
db.connect((err) => {
    if (err) {
        console.log("DB connection error:", err);
    } else {
        console.log("MySQL Connected");
    }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
app.use("/uploads", express.static("uploads"));


// ================= REGISTER API =================

app.post("/register", async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, email, hashedPassword, phone, role], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error inserting user" + err });
        }
        res.json({ message: "User registered successfully" });
    });
});

// ================= Add Product API =================

// app.post("/addproduct", verifyToken, (req, res) => {
//   const { name, price, quantity, category, description } = req.body;

//   if (!name || !price || !category || !description) {
//     return res.status(400).json({ message: "All fields required" });
//   }

//   //MySQL insert query
//   const sql = "INSERT INTO products (name, price, quantity, category, description) VALUES (?, ?, ?, ?, ?)";
//     db.query(sql, [name, price, quantity, category, description], (err, result) => {

//         if (err) {
//             return res.status(500).json({ message: "Error inserting user" + err });
//         }

//         res.json({ message: "Product Added Successfully...!" });
//     });

// });


app.post("/addproduct", verifyToken, upload.single("image"), (req, res) => {

  const { name, price, quantity, category, description } = req.body;

  const image = req.file.filename;

  const sql = `
    INSERT INTO products (name, price, quantity, category, description, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, price, quantity, category, description, image], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Product added successfully" });
  });

});


// ================= LOGIN API =================

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) return res.status(500).json({ message: "Server error" });

        if (result.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        if (email === user.email && isMatch) {
            const token = jwt.sign(
                { id: user.id, email: user.email },
                SECRET_KEY,
                { expiresIn: "1h" }
            );

            return res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
        res.json({ message: "Login successful", user: user });
    });

});
// Api to dashboard 
app.get("/dashboard", verifyToken, (req, res) => {

  const sql = "SELECT * FROM products";

  db.query(sql, (err, result) => {
    
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// search products
app.get("/products/search", verifyToken, (req, res) => {
  const q = (req.query.q || "").toString().trim();
  const keyword = `%${q}%`;

  const sql = `
    SELECT * FROM products
    WHERE CAST(id AS CHAR) LIKE ? OR name LIKE ? OR category LIKE ?
  `;

  db.query(sql, [keyword, keyword, keyword], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// get single product by ID for editing
app.get("/product/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM products WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(result[0]);
  });
});

// update product details (image optional)
app.put("/product/:id", verifyToken, upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, category, description } = req.body;
  let sql, params;

  if (req.file) {
    // new image uploaded
    const image = req.file.filename;
    sql = `
      UPDATE products
      SET name = ?, price = ?, quantity = ?, category = ?, description = ?, image = ?
      WHERE id = ?
    `;
    params = [name, price, quantity, category, description, image, id];
  } else {
    sql = `
      UPDATE products
      SET name = ?, price = ?, quantity = ?, category = ?, description = ?
      WHERE id = ?
    `;
    params = [name, price, quantity, category, description, id];
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Product updated successfully" });
  });
});

// delete product
app.delete("/product/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const getProductSql = "SELECT image FROM products WHERE id = ?";
  db.query(getProductSql, [id], (getErr, productRows) => {
    if (getErr) return res.status(500).json({ message: "Error fetching product" });
    if (productRows.length === 0) return res.status(404).json({ message: "Product not found" });

    const imageName = productRows[0].image;
    const deleteSql = "DELETE FROM products WHERE id = ?";

    db.query(deleteSql, [id], (deleteErr) => {
      if (deleteErr) return res.status(500).json({ message: "Error deleting product" });

      // Keep deletion resilient: file cleanup failure should not fail DB delete.
      if (imageName) {
        const imagePath = path.join(__dirname, "uploads", imageName);
        fs.unlink(imagePath, () => {
          return res.json({ message: "Product deleted successfully" });
        });
      } else {
        return res.json({ message: "Product deleted successfully" });
      }
    });
  });
});

// ================= ORDER MANAGEMENT APIS =================

// Create a new order
app.post("/orders", verifyToken, (req, res) => {
  const { customerName, email, phone, address, items, totalAmount, paymentMethod } = req.body;
  const userId = req.user.id;

  if (!customerName || !email || !items || !totalAmount) {
    return res.status(400).json({ message: "Missing required order information" });
  }

  const sql = `
    INSERT INTO orders (userId, customerName, email, phone, address, totalAmount, paymentMethod, status, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
  `;

  db.query(
    sql,
    [userId, customerName, email, phone, address, totalAmount, paymentMethod],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error creating order", error: err });

      const orderId = result.insertId;

      // Insert order items into order_items table
      const itemsSQL = `
        INSERT INTO order_items (orderId, productId, productName, quantity, price)
        VALUES ?
      `;

      const itemsData = items.map((item) => [
        orderId,
        item.productId,
        item.productName,
        item.quantity,
        item.price,
      ]);

      db.query(itemsSQL, [itemsData], (itemErr) => {
        if (itemErr) {
          return res.status(500).json({ message: "Error adding items to order", error: itemErr });
        }

        res.json({
          success: true,
          message: "Order created successfully",
          orderId: orderId,
        });
      });
    }
  );
});

// Get all orders for a user
app.get("/orders", verifyToken, (req, res) => {
  const userId = req.user.id;
  const sql = "SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC";

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error fetching orders", error: err });
    res.json(result);
  });
});

// Get specific order by ID
app.get("/orders/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const orderSQL = "SELECT * FROM orders WHERE id = ? AND userId = ?";

  db.query(orderSQL, [id, userId], (err, orders) => {
    if (err) return res.status(500).json({ message: "Error fetching order", error: err });
    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const itemsSQL = "SELECT * FROM order_items WHERE orderId = ?";

    db.query(itemsSQL, [id], (itemErr, items) => {
      if (itemErr) {
        return res.status(500).json({ message: "Error fetching order items", error: itemErr });
      }

      res.json({
         ...orders[0],
        items: items,
      });
    });
  });
});

// Update order status (admin only)
app.put("/orders/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  const sql = "UPDATE orders SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error updating order", error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order updated successfully" });
  });
});

function verifyToken(req, res, next) {

  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(403).json({ message: "Token required" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Invalid token" });

    req.user = decoded;
    next();
  });
}




// Start Server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
