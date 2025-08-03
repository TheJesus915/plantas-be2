import { IsEnum, IsNotEmpty, IsOptional, IsObject, IsString } from 'class-validator';
import { FaqNodeType } from '../../domain/entities/faq-node.entity';

export class CreateFaqNodeDto {
  @IsNotEmpty({ message: 'Content is required' })
  @IsObject({ message: 'Content must be a valid object' })
  content: Record<string, any>;

  @IsNotEmpty({ message: 'FAQ node type is required' })
  @IsEnum(FaqNodeType, { message: 'Invalid FAQ node type' })
  type: FaqNodeType;

  @IsOptional()
  @IsString({ message: 'Parent ID must be a string' })
  parentId?: string;
}