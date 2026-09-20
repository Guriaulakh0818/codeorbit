package com.codeorbit.dto;

public class LessonPublicDto {
    private Long id;
    private Long moduleId;
    private String moduleTitle;
    private String courseSlug;
    private String courseTitle;
    private String title;
    private String slug;
    private int estimatedMinutes;
    private int orderIndex;
    private String content;
    private String activeLanguageServed; // 'en' or 'hinglish'
    private boolean isFallback;
    private String hinglishStatus;
    private String codeSnippetJava;
    private String codeSnippetCpp;
    private String codeSnippetPython;
    private String codeSnippetJs;
    private String previousLessonSlug;
    private String nextLessonSlug;

    public LessonPublicDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    public String getModuleTitle() {
        return moduleTitle;
    }

    public void setModuleTitle(String moduleTitle) {
        this.moduleTitle = moduleTitle;
    }

    public String getCourseSlug() {
        return courseSlug;
    }

    public void setCourseSlug(String courseSlug) {
        this.courseSlug = courseSlug;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
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

    public int getEstimatedMinutes() {
        return estimatedMinutes;
    }

    public void setEstimatedMinutes(int estimatedMinutes) {
        this.estimatedMinutes = estimatedMinutes;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getActiveLanguageServed() {
        return activeLanguageServed;
    }

    public void setActiveLanguageServed(String activeLanguageServed) {
        this.activeLanguageServed = activeLanguageServed;
    }

    public boolean isFallback() {
        return isFallback;
    }

    public void setFallback(boolean fallback) {
        isFallback = fallback;
    }

    public String getHinglishStatus() {
        return hinglishStatus;
    }

    public void setHinglishStatus(String hinglishStatus) {
        this.hinglishStatus = hinglishStatus;
    }

    public String getCodeSnippetJava() {
        return codeSnippetJava;
    }

    public void setCodeSnippetJava(String codeSnippetJava) {
        this.codeSnippetJava = codeSnippetJava;
    }

    public String getCodeSnippetCpp() {
        return codeSnippetCpp;
    }

    public void setCodeSnippetCpp(String codeSnippetCpp) {
        this.codeSnippetCpp = codeSnippetCpp;
    }

    public String getCodeSnippetPython() {
        return codeSnippetPython;
    }

    public void setCodeSnippetPython(String codeSnippetPython) {
        this.codeSnippetPython = codeSnippetPython;
    }

    public String getCodeSnippetJs() {
        return codeSnippetJs;
    }

    public void setCodeSnippetJs(String codeSnippetJs) {
        this.codeSnippetJs = codeSnippetJs;
    }

    public String getPreviousLessonSlug() {
        return previousLessonSlug;
    }

    public void setPreviousLessonSlug(String previousLessonSlug) {
        this.previousLessonSlug = previousLessonSlug;
    }

    public String getNextLessonSlug() {
        return nextLessonSlug;
    }

    public void setNextLessonSlug(String nextLessonSlug) {
        this.nextLessonSlug = nextLessonSlug;
    }
}
