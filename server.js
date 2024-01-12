const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("./model/userModel");
const todoModel = require("./model/todoModel");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send("Hello Node API");
});
app.post('/signup', async(req,res)=>{
    try{
        const user=await userModel.create(req.body)
        res.status(200).json(user)
    }catch(error){
        console.log(error.message);
        res.status(500).json({message:error.message})
    }
})


app.post("/create", async (req, res) => {
  try {
    // Assuming the request body includes 'list' and 'image' (binary data)
    const { list, image } = req.body;

    // Decode the base64 image data
    const imageData = Buffer.from(image, "base64");

    const todo = await todoModel.create({
      list,
      image: { data: imageData, contentType: "image/png" },
    });

    res.status(200).json(todo);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await userModel.findOne({ username });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/logout", async (req, res) => {
  try {
    const { token } = req.body;
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.get("/todo", async (req, res) => {
  try {
    const list = await todoModel.find({});
    res.status(200).json(list);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await todoModel.findById(id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(todo);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await todoModel.findByIdAndUpdate(id, req.body);

    if (!todo) {
      return res.status(404).json("todo not found");
    }
    const updatedTodo = await todoModel.findById(id);

    res.status(204).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await todoModel.findByIdAndDelete(id, req.body);
    if (!todo) {
      return res.status(404).json("todo not found");
    }
    res.status(204).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://mathewsjacob198pb:mathews191619@cluster0.jkbtton.mongodb.net/"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3001, () => {
      console.log("Node API is running on port 3001");
    });
  })
  .catch((error) => {
    console.log(error);
  });
