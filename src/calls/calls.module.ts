import { Call, CallSchema } from './schema/call.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { CallRepository } from './Call.repository';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Call.name,
        useFactory: () => {
          const schema = CallSchema;
          schema.pre(/find/, function (next) {
            this.populate('from', 'name | image');
            this.populate('to', 'name | image');
            next();
          });

          return schema;
        },
      },
    ]),
  ],
  controllers: [CallsController],
  providers: [CallsService, CallRepository],
  exports: [CallRepository],
})
export class CallsModule {}
