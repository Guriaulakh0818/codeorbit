package com.codeorbit.dto;

import jakarta.validation.constraints.NotNull;

public class AdminEbookStatusRequestDto {

    @NotNull(message = "Active status is required")
    private Boolean active;

    public AdminEbookStatusRequestDto() {
    }

    public AdminEbookStatusRequestDto(Boolean active) {
        this.active = active;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
