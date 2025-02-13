package com.damul.api.chat.dto.request;

import com.damul.api.chat.dto.MessageType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageCreate {

    private MessageType messageType;  // ENUM('TEXT', 'IMAGE', 'FILE')
    private String content;
    private MultipartFile image;

}
