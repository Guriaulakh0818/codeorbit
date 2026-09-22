package com.codeorbit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "placement_kit_categories", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"placement_kit_id", "slug"}, name = "uk_pk_category_kit_slug")
})
public class PlacementKitCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "placement_kit_id", nullable = false)
    private PlacementKit placementKit;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String title;

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String slug;

    @Size(max = 500)
    @Column(length = 500)
    private String description;

    @Column(name = "order_index", nullable = false)
    private int orderIndex = 1;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<PlacementKitQuestion> questions = new ArrayList<>();

    public PlacementKitCategory() {
    }

    public PlacementKitCategory(PlacementKit placementKit, String title, String slug, String description, int orderIndex) {
        this.placementKit = placementKit;
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.orderIndex = orderIndex;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PlacementKit getPlacementKit() {
        return placementKit;
    }

    public void setPlacementKit(PlacementKit placementKit) {
        this.placementKit = placementKit;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public List<PlacementKitQuestion> getQuestions() {
        return questions;
    }

    public void setQuestions(List<PlacementKitQuestion> questions) {
        this.questions = questions;
    }
}
