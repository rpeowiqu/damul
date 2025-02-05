package com.damul.api.file.dto.type;

public enum FileType {
    USER_PROFILE("user/profile"),
    USER_BACKGROUND("user/background"),
    RECIPE_THUMBNAIL("recipe/thumbnail"),
    RECIPE_STEP("recipe/step"),
    POST_IMAGE("post/image");

    private final String directory;

    FileType(String directory) {
        this.directory = directory;
    }

    public String getDirectory() {
        return directory;
    }
}
