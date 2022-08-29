const mongoose = require("mongoose");
mongoose.Promise = global.Promise


mongoose
  .connect(
    "mongodb+srv://guilherme09396:<password>@cluster0.1wkvpj7.mongodb.net/test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Conectado ao mongodb");
  })
  .catch((err) => {
    console.error(err);
  });