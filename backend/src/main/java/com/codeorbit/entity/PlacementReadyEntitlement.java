package com.codeorbit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "placement_ready_entitlements", uniqueConstraints = {
    @UniqueConstraint(name = "uk_entitlement_user_course", columnNames = {"user_id", "course_id"}),
    @UniqueConstraint(name = "uk_entitlement_user_subcourse", columnNames = {"user_id", "subcourse_id"})
}, indexes = {
    @Index(name = "idx_entitlements_user", columnList = "user_id"),
    @Index(name = "idx_entitlements_course", columnList = "course_id")
})
public class PlacementReadyEntitlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subcourse_id", nullable = false)
    private Subcourse subcourse;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payment_id", nullable = false)
    private PlacementReadyPayment payment;

    @Column(name = "granted_at", nullable = false, updatable = false)
    private LocalDateTime grantedAt;

    public PlacementReadyEntitlement() {
    }

    public PlacementReadyEntitlement(User user, Course course, Subcourse subcourse, PlacementReadyPayment payment) {
        this.user = user;
        this.course = course;
        this.subcourse = subcourse;
        this.payment = payment;
    }

    @PrePersist
    protected void onCreate() {
        if (this.grantedAt == null) {
            this.grantedAt = LocalDateTime.now();
        }
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

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Subcourse getSubcourse() {
        return subcourse;
    }

    public void setSubcourse(Subcourse subcourse) {
        this.subcourse = subcourse;
    }

    public PlacementReadyPayment getPayment() {
        return payment;
    }

    public void setPayment(PlacementReadyPayment payment) {
        this.payment = payment;
    }

    public LocalDateTime getGrantedAt() {
        return grantedAt;
    }

    public void setGrantedAt(LocalDateTime grantedAt) {
        this.grantedAt = grantedAt;
    }
}
