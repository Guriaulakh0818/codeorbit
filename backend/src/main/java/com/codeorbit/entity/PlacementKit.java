package com.codeorbit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "placement_kits", uniqueConstraints = {
    @UniqueConstraint(columnNames = "slug", name = "uk_placement_kits_slug")
})
public class PlacementKit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String title;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String role;

    @NotBlank
    @Size(max = 500)
    @Column(name = "short_description", nullable = false, length = 500)
    private String shortDescription;

    @Lob
    @Column(name = "full_description", columnDefinition = "TEXT")
    private String fullDescription;

    @Column(name = "price_inr", nullable = false)
    private int priceInr = 99; // Server-controlled ₹99

    @Column(name = "price_paise", nullable = false)
    private int pricePaise = 9900; // 9900 paise

    @Column(nullable = false, length = 10)
    private String currency = "INR";

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @Column(name = "badge_text", length = 50)
    private String badgeText = "₹99 Placement Kit";

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "order_index", nullable = false)
    private int orderIndex = 1;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "placementKit", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<PlacementKitCategory> categories = new ArrayList<>();

    public PlacementKit() {
    }

    public PlacementKit(String slug, String title, String role, String shortDescription, String fullDescription, int orderIndex) {
        this.slug = slug;
        this.title = title;
        this.role = role;
        this.shortDescription = shortDescription;
        this.fullDescription = fullDescription;
        this.orderIndex = orderIndex;
        this.priceInr = 99;
        this.pricePaise = 9900;
        this.currency = "INR";
        this.active = true;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.currency == null) this.currency = "INR";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getFullDescription() {
        return fullDescription;
    }

    public void setFullDescription(String fullDescription) {
        this.fullDescription = fullDescription;
    }

    public int getPriceInr() {
        return priceInr;
    }

    public void setPriceInr(int priceInr) {
        this.priceInr = priceInr;
    }

    public int getPricePaise() {
        return pricePaise;
    }

    public void setPricePaise(int pricePaise) {
        this.pricePaise = pricePaise;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public String getBadgeText() {
        return badgeText;
    }

    public void setBadgeText(String badgeText) {
        this.badgeText = badgeText;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public List<PlacementKitCategory> getCategories() {
        return categories;
    }

    public void setCategories(List<PlacementKitCategory> categories) {
        this.categories = categories;
    }
}
