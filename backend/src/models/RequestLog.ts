
import mongoose, { Schema } from "mongoose";

export interface IRequestLog extends Document {
    apiKeyId: mongoose.Types.ObjectId,
    endpoint: string,
    method: string,
    statusCode: number,
    success: boolean,
    responseTime: number,
    gateway: string,
}

const RequestLogSchema = new Schema<IRequestLog>(
    {
        apiKeyId: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true 
        },
        endpoint: { 
            type: String, 
            required: true 
        },
        method: { 
            type: String, 
            required: true 
        },
        statusCode: { 
            type: Number, 
            required: true 
        },
        success: { 
            type: Boolean, 
            required: true 
        },
        responseTime: { 
            type: Number, 
            required: true 
        },
        gateway: { 
            type: String, 
            default: null 
        },
    }, {timestamps: true}
)

export default mongoose.model("RequestLog", RequestLogSchema);