package com.codeorbit.dto;

public class SitemapEntryDto {
    private String loc;
    private String changefreq;
    private double priority;
    private String lastmod;

    public SitemapEntryDto() {
    }

    public SitemapEntryDto(String loc, String changefreq, double priority) {
        this.loc = loc;
        this.changefreq = changefreq;
        this.priority = priority;
    }

    public SitemapEntryDto(String loc, String changefreq, double priority, String lastmod) {
        this.loc = loc;
        this.changefreq = changefreq;
        this.priority = priority;
        this.lastmod = lastmod;
    }

    public String getLoc() {
        return loc;
    }

    public void setLoc(String loc) {
        this.loc = loc;
    }

    public String getChangefreq() {
        return changefreq;
    }

    public void setChangefreq(String changefreq) {
        this.changefreq = changefreq;
    }

    public double getPriority() {
        return priority;
    }

    public void setPriority(double priority) {
        this.priority = priority;
    }

    public String getLastmod() {
        return lastmod;
    }

    public void setLastmod(String lastmod) {
        this.lastmod = lastmod;
    }
}
