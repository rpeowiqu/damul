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

    private int userId;
    private MessageType messageType;  // ENUM('TEXT', 'IMAGE', 'FILE')
    private String content;
    private String image; // bitcode? bytecode?로 받을 예정

}
