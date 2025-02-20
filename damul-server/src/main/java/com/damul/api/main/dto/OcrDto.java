package com.damul.api.main.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OcrDto {

    String ingredientName;

    String category;

    int productPrice;

    String expiration_date;

    String ingredientStorage;

}
