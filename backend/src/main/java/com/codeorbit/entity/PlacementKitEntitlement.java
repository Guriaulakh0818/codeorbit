package com.codeorbit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "placement_kit_entitlements", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "placement_kit_id"}, name = "uk_pk_user_entitlement")
}, indexes = {
    @Index(name = "idx_pk_entitlement_user", columnList = "user_id")
})
public class PlacementKitEntitlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "placement_kit_id", nullable = false)
    private PlacementKit placementKit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    private PlacementKitPayment payment;

    @Column(name = "granted_at", nullable = false, updatable = false)
    private LocalDateTime grantedAt;

    public PlacementKitEntitlement() {
    }

    public PlacementKitEntitlement(User user, PlacementKit placementKit, PlacementKitPayment payment) {
        this.user = user;
        this.placementKit = placementKit;
        this.payment = payment;
    }

    @PrePersist
    protected void onCreate() {
        this.grantedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public PlacementKit getPlacementKit() {
        return placementKit;
    }

    public void setPlacementKit(PlacementKit placementKit) {
        this.placementKit = placementKit;
    }

    public PlacementKitPayment getPayment() {
        return payment;
    }

    public void setPayment(PlacementKitPayment payment) {
        this.payment = payment;
    }

    public LocalDateTime getGrantedAt() {
        return grantedAt;
    }
}
