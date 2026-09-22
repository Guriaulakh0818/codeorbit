package com.codeorbit.dto;

public class PlacementReadyStatusDto {

    private String courseSlug;
    private boolean hasAccess;
    private boolean isPrerequisitePassed;
    private int priceInr;
    private String orderNumber;

    public PlacementReadyStatusDto() {
    }

    public PlacementReadyStatusDto(String courseSlug, boolean hasAccess, boolean isPrerequisitePassed, int priceInr, String orderNumber) {
        this.courseSlug = courseSlug;
        this.hasAccess = hasAccess;
        this.isPrerequisitePassed = isPrerequisitePassed;
        this.priceInr = priceInr;
        this.orderNumber = orderNumber;
    }

    public String getCourseSlug() {
        return courseSlug;
    }

    public void setCourseSlug(String courseSlug) {
        this.courseSlug = courseSlug;
    }

    public boolean isHasAccess() {
        return hasAccess;
    }

    public void setHasAccess(boolean hasAccess) {
        this.hasAccess = hasAccess;
    }

    public boolean isPrerequisitePassed() {
        return isPrerequisitePassed;
    }

    public void setPrerequisitePassed(boolean prerequisitePassed) {
        isPrerequisitePassed = prerequisitePassed;
    }

    public int getPriceInr() {
        return priceInr;
    }

    public void setPriceInr(int priceInr) {
        this.priceInr = priceInr;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }
}
