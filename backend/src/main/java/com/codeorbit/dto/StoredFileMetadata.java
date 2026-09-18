package com.codeorbit.dto;

public class StoredFileMetadata {

    private String originalFileName;
    private String storageKey;
    private long fileSize;

    public StoredFileMetadata() {
    }

    public StoredFileMetadata(String originalFileName, String storageKey, long fileSize) {
        this.originalFileName = originalFileName;
        this.storageKey = storageKey;
        this.fileSize = fileSize;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public String getStorageKey() {
        return storageKey;
    }

    public void setStorageKey(String storageKey) {
        this.storageKey = storageKey;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }
}
