const express = require("express");
const router = express.Router();

// pug return html
router.get("/", (req, res) => {
  res.render("index", { title: " My Crud router", message: "learning" });
});

module.exports = router;
