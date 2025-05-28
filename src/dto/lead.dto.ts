// src/dto/CreateLeadDto.ts
import { IsString, IsNumber, IsEmail, IsDateString, IsEnum, IsArray, ValidateNested, IsPhoneNumber, Min, Max, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { HolderDTO } from './holder.dto';

export class LeadDTO {
    @IsNumber({}, { message: 'L\'importo del mutuo richiesto deve essere un numero.' })
    @Min(0, { message: 'L\'importo del mutuo non può essere negativo.' })
    mortgageAmount!: number;

    @IsNumber({}, { message: 'Il valore della casa deve essere un numero.' })
    @Min(0, { message: 'Il valore della casa non può essere negativo.' })
    homeValue!: number;

    @IsString({ message: 'La città è richiesta e deve essere una stringa.' })
    @Length(2, 100, { message: 'La città deve avere tra 2 e 100 caratteri.' })
    city!: string;

    // @IsPhoneNumber('IT', { message: 'Il numero di telefono non è valido per il formato italiano.' })
    phoneNumber!: string;

    @IsArray({ message: 'Gli intestatari devono essere un array.' })
    @ValidateNested({ each: true })
    @Type(() => HolderDTO)
    holders!: HolderDTO[];
}

