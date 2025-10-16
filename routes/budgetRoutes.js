const express = require('express')
const router = express.Router();
const controllers = require('../controllers/budgetController')

router.post("/add", controllers.addBudget);
router.get("/budget", controllers.getBudget )
router.delete("/delete/:id", controllers.deleteBudget)
router.put("/update/:id", controllers.updateBudget )

module.exports = router;