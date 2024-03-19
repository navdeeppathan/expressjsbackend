import mongoose from "mongoose";

const connectDBase=async(DATABASE_URL)=>{
    try {
        const DB_OPTIONS={
            dbName:'myDataBase'
        }
        await mongoose.connect(DATABASE_URL,DB_OPTIONS)
        console.log('cennected successfully....')
    } catch (error) {
        console.log(error)
    }
}
export default connectDBase;