package com.codeorbit.dto;

import java.math.BigDecimal;

public class AdminDashboardMetricsDto {

    private long totalEbooks;
    private long publishedEbooks;
    private long unpublishedEbooks;
    private long totalOrders;
    private long paidOrders;
    private long pendingOrders;
    private long failedOrders;
    private BigDecimal totalRevenue;
    private long totalStudents;

    public AdminDashboardMetricsDto() {
    }

    public AdminDashboardMetricsDto(long totalEbooks, long publishedEbooks, long unpublishedEbooks,
                                   long totalOrders, BigDecimal totalRevenue) {
        this.totalEbooks = totalEbooks;
        this.publishedEbooks = publishedEbooks;
        this.unpublishedEbooks = unpublishedEbooks;
        this.totalOrders = totalOrders;
        this.paidOrders = totalOrders;
        this.pendingOrders = 0;
        this.failedOrders = 0;
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
        this.totalStudents = 0;
    }

    public AdminDashboardMetricsDto(long totalEbooks, long publishedEbooks, long unpublishedEbooks,
                                   long totalOrders, long paidOrders, long pendingOrders, long failedOrders,
                                   BigDecimal totalRevenue, long totalStudents) {
        this.totalEbooks = totalEbooks;
        this.publishedEbooks = publishedEbooks;
        this.unpublishedEbooks = unpublishedEbooks;
        this.totalOrders = totalOrders;
        this.paidOrders = paidOrders;
        this.pendingOrders = pendingOrders;
        this.failedOrders = failedOrders;
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
        this.totalStudents = totalStudents;
    }

    public long getTotalEbooks() {
        return totalEbooks;
    }

    public void setTotalEbooks(long totalEbooks) {
        this.totalEbooks = totalEbooks;
    }

    public long getPublishedEbooks() {
        return publishedEbooks;
    }

    public void setPublishedEbooks(long publishedEbooks) {
        this.publishedEbooks = publishedEbooks;
    }

    public long getUnpublishedEbooks() {
        return unpublishedEbooks;
    }

    public void setUnpublishedEbooks(long unpublishedEbooks) {
        this.unpublishedEbooks = unpublishedEbooks;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getPaidOrders() {
        return paidOrders;
    }

    public void setPaidOrders(long paidOrders) {
        this.paidOrders = paidOrders;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getFailedOrders() {
        return failedOrders;
    }

    public void setFailedOrders(long failedOrders) {
        this.failedOrders = failedOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }
}
