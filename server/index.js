const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();

const app=express();

app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/tasks',taskRoutes);

app.get('/api/health',(req,res) =>{
    res.json({status:'ok',message: 'FocusBoard API is running'});
});

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('MongoDB connected');
    const PORT= process.env.PORT || 5000;
    app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
    console.error('MongoDB conn failed:',err.message);
    process.exit(1);
})