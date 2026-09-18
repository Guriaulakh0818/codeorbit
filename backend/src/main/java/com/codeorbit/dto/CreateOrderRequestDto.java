package com.codeorbit.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class CreateOrderRequestDto {

    @NotEmpty(message = "At least one e-book ID must be specified")
    private List<Long> ebookIds;

    public CreateOrderRequestDto() {
    }

    public CreateOrderRequestDto(List<Long> ebookIds) {
        this.ebookIds = ebookIds;
    }

    public List<Long> getEbookIds() {
        return ebookIds;
    }

    public void setEbookIds(List<Long> ebookIds) {
        this.ebookIds = ebookIds;
    }
}
