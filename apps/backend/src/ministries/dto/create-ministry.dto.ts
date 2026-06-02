import { IsString, IsOptional, IsNumber, IsObject, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMinistryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  mission?: string;

  @IsObject()
  @IsOptional()
  impactMetrics?: Record<string, any>;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  goalAmount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  raisedAmount?: number;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  bannerUrl?: string;
}
