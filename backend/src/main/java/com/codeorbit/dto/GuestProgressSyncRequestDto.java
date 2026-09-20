package com.codeorbit.dto;

import java.util.ArrayList;
import java.util.List;

public class GuestProgressSyncRequestDto {
    private List<Long> completedLessonIds = new ArrayList<>();
    private List<Long> bookmarkedLessonIds = new ArrayList<>();

    public GuestProgressSyncRequestDto() {
    }

    public List<Long> getCompletedLessonIds() {
        return completedLessonIds;
    }

    public void setCompletedLessonIds(List<Long> completedLessonIds) {
        this.completedLessonIds = completedLessonIds;
    }

    public List<Long> getBookmarkedLessonIds() {
        return bookmarkedLessonIds;
    }

    public void setBookmarkedLessonIds(List<Long> bookmarkedLessonIds) {
        this.bookmarkedLessonIds = bookmarkedLessonIds;
    }
}
