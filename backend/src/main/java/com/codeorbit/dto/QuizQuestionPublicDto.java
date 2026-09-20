package com.codeorbit.dto;

import java.util.ArrayList;
import java.util.List;

public class QuizQuestionPublicDto {
    private Long id;
    private String prompt;
    private String codeContext;
    private int orderIndex;
    private List<QuizQuestionOptionDto> options = new ArrayList<>();

    public QuizQuestionPublicDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getCodeContext() {
        return codeContext;
    }

    public void setCodeContext(String codeContext) {
        this.codeContext = codeContext;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public List<QuizQuestionOptionDto> getOptions() {
        return options;
    }

    public void setOptions(List<QuizQuestionOptionDto> options) {
        this.options = options;
    }
}
