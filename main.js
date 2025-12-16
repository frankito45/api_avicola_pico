import app from './app.js'

const PORT =  process.env.PORT;

app.listen(PORT || 3000, () => {
    console.log(` Servidor ejecutándose en puerto ${process.env.PORT || 3000}`);
});




