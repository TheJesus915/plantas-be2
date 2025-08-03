import { IsString, IsNotEmpty, IsOptional, IsObject, IsArray } from 'class-validator';

export class NotificationDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString({ message: 'Body must be a string' })
  @IsNotEmpty({ message: 'Body is required' })
  body: string;

  @IsOptional()
  @IsObject({ message: 'Data must be an object' })
  data?: Record<string, any>;
}

export class TopicNotificationDto extends NotificationDto {
  @IsString({ message: 'Topic name must be a string' })
  @IsNotEmpty({ message: 'Topic name is required' })
  topicName: string;
}

export class UserNotificationDto extends NotificationDto {
  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;
}

export class MultipleTopicsNotificationDto extends NotificationDto {
  @IsArray({ message: 'Topic names must be an array' })
  @IsString({ each: true, message: 'Each topic name must be a string' })
  @IsNotEmpty({ each: true, message: 'Each topic name must not be empty' })
  topicNames: string[];
}

export class NotificationResponseDto {
  id: string;
}