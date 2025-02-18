package com.damul.api.common.sse;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class EmitterInfo implements Serializable {

    private int userId;
    private String createdAt;

}