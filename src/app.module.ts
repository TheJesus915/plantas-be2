import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { ModulesModule } from './modules/modules.module';
import { RolesModule } from './roles/roles.module';
import { PlantsModule } from './plants/plants.module';
import { UserGardenModule } from './user-garden/user-garden.module';
import { DevicesModule } from './devices/devices.module';
import { AdminManagementModule } from './admin-management/admin-management.module';
import { TaxonomyModule } from './taxonomy/taxonomy.module';
import { ReadingsModule } from './readings/readings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WateringModule } from './watering/watering.module';
import { LightingModule } from './lighting/lighting.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ProfileManagementModule } from './profile-management/profile-management.module';
import { UsersGeneralManagementModule } from './users-general-management/users-general-management.module';
import { FaqsModule } from './faqs/faqs.module';
import { MarketplacecategoryModule } from './marketplacecategory/marketplacecategory.module';

@Module({
  imports: [ProfileManagementModule, SharedModule, ConfigModule.forRoot({
    isGlobal: true,
  }), ScheduleModule.forRoot(),AuthModule, ModulesModule, RolesModule, PlantsModule, UserGardenModule, DevicesModule, AdminManagementModule, TaxonomyModule,WateringModule, ReadingsModule, NotificationsModule, LightingModule, UsersGeneralManagementModule, FaqsModule, MarketplacecategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}