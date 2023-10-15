import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type RequestLogDocument = HydratedDocument<RequestLog>;

@Schema({
    collection: 'api-request-log',
    timeseries: { timeField: 'createdAt', metaField: 'path' },
})
export class RequestLog {
    @Prop({ required: true })
    createdAt: Date;

    @Prop()
    method: string;

    @Prop()
    path: string;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    query: any;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    user: any;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    response: any;

    @Prop()
    ip: string;

    @Prop()
    latencyMs: number;
}

export const RequestLogSchema = SchemaFactory.createForClass(RequestLog);
