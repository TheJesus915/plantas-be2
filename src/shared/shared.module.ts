import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './infrastructure/services/mail.service';
import { PrismaService } from './infrastructure/services/prisma.service';
import { SuperAdminGuard } from './infrastructure/guards/super-admin.guard';
import { PaginationService } from './infrastructure/services/pagination.service';
import { StorageService } from './infrastructure/services/storage.service';
import { NotificationService } from './infrastructure/services/notification.service';
@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        MailService,
        PrismaService,
        SuperAdminGuard,
        PaginationService,
        StorageService,
        {
            provide: 'INotificationService',
            useClass: NotificationService
        },
        NotificationService
    ],
    exports: [
        MailService,
        PrismaService,
        SuperAdminGuard,
        PaginationService,
        StorageService,
        'INotificationService',
        NotificationService
    ],
})
export class SharedModule {}