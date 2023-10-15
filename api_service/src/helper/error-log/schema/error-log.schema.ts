import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type ErrorLogDocument = HydratedDocument<ErrorLog>;

@Schema({
    collection: 'api-error-log',
    timeseries: { timeField: 'createdAt', metaField: 'path' },
})
export class ErrorLog {
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

    @Prop()
    ip: string;

    @Prop()
    status: number;

    @Prop()
    statusText: string;

    @Prop()
    message: string;
}

export const ErrorLogSchema = SchemaFactory.createForClass(ErrorLog);
