import { IsString, IsNumber, IsEmail, IsDateString, IsEnum, IsArray, ValidateNested, IsPhoneNumber, Min, Max, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { HolderType } from '../models/holder.model';

export class HolderDTO {
    @IsEnum(HolderType, { message: 'Il tipo di intestatario deve essere "first" o "second".' })
    type!: HolderType;

    @IsString({ message: 'Il nome dell\'intestatario è richiesto e deve essere una stringa.' })
    @Length(2, 100, { message: 'Il nome deve avere tra 2 e 100 caratteri.' })
    firstName!: string;

    @IsString({ message: 'Il cognome dell\'intestatario è richiesto e deve essere una stringa.' })
    @Length(2, 100, { message: 'Il cognome deve avere tra 2 e 100 caratteri.' })
    lastName!: string;

    @IsEmail({}, { message: 'L\'indirizzo email non è valido.' })
    email!: string;

    @IsDateString({}, { message: 'La data di nascita deve essere una stringa di data valida (es. 1990-01-01).' })
    dateOfBirth!: string;

    @IsNumber({}, { message: 'Il reddito mensile deve essere un numero.' })
    @Min(0, { message: 'Il reddito mensile non può essere negativo.' })
    monthlyIncome!: number;

    @IsNumber({}, { message: 'La suddivisione del reddito mensile deve essere un numero.' })
    @IsEnum([12, 13, 14], { message: 'La suddivisione del reddito deve essere 12, 13 o 14.' })
    incomeBreakdown!: 12 | 13 | 14;
}