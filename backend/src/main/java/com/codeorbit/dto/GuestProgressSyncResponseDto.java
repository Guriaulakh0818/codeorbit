package com.codeorbit.dto;

import java.util.ArrayList;
import java.util.List;

public class GuestProgressSyncResponseDto {
    private int newLessonsCompleted;
    private int newBookmarksAdded;
    private List<Long> totalCompletedLessonIds = new ArrayList<>();
    private List<Long> totalBookmarkedLessonIds = new ArrayList<>();

    public GuestProgressSyncResponseDto() {
    }

    public int getNewLessonsCompleted() {
        return newLessonsCompleted;
    }

    public void setNewLessonsCompleted(int newLessonsCompleted) {
        this.newLessonsCompleted = newLessonsCompleted;
    }

    public int getNewBookmarksAdded() {
        return newBookmarksAdded;
    }

    public void setNewBookmarksAdded(int newBookmarksAdded) {
        this.newBookmarksAdded = newBookmarksAdded;
    }

    public List<Long> getTotalCompletedLessonIds() {
        return totalCompletedLessonIds;
    }

    public void setTotalCompletedLessonIds(List<Long> totalCompletedLessonIds) {
        this.totalCompletedLessonIds = totalCompletedLessonIds;
    }

    public List<Long> getTotalBookmarkedLessonIds() {
        return totalBookmarkedLessonIds;
    }

    public void setTotalBookmarkedLessonIds(List<Long> totalBookmarkedLessonIds) {
        this.totalBookmarkedLessonIds = totalBookmarkedLessonIds;
    }
}
