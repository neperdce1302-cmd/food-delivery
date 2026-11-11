import 'dotenv/config'
import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

// Configuración
const app = express()
const port = process.env.PORT || 4000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
    origin: [
        "https://food-delivery-admin-livid-one.vercel.app",
        "https://food-delivery-gold-sigma.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use(express.json())

// Archivos estáticos
app.use("/images", express.static(path.join(__dirname, "uploads")))

// API endpoints
app.use("/api/food", foodRouter)
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

app.get("/", (req, res) => {
    res.send("API Working")
})

// Conexión y servidor
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server Started on port ${port}`)
    })
})
