package com.damul.api.chat.entity;

import com.damul.api.auth.entity.User;
import com.damul.api.chat.dto.MessageType;
import com.damul.api.chat.dto.response.ChatMessageResponse;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "chat_messages")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatMessage {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", referencedColumnName = "id")
    private ChatRoom room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", referencedColumnName = "id")
    private User sender;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false)
    private MessageType messageType;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (messageType == null) {
            messageType = MessageType.TEXT;
        }
    }

    public static ChatMessage createSystemMessage(ChatRoom room, String content) {
        ChatMessage message = new ChatMessage();
        message.room = room;
        message.messageType = MessageType.SYSTEM;
        message.content = content;
        return message;
    }

    public static ChatMessage createMessage(ChatRoom room, User sender, String content, MessageType messageType) {
        ChatMessage message = new ChatMessage();
        message.room = room;
        message.sender = sender;
        message.content = content;
        message.messageType = messageType;
        return message;
    }

    public static ChatMessage createFileMessage(ChatRoom room, User sender, String content, String fileUrl) {
        ChatMessage message = new ChatMessage();
        message.room = room;
        message.sender = sender;
        message.content = content;
        message.fileUrl = fileUrl;
        message.messageType = MessageType.FILE;
        return message;
    }

    // ENTER, LEAVE 메시지용 팩토리 메서드
    public static ChatMessage createEnterMessage(ChatRoom room, User sender) {
        ChatMessage message = new ChatMessage();
        message.room = room;
        message.sender = sender;
        message.messageType = MessageType.ENTER;
        message.content = sender.getNickname() + "님이 입장하셨습니다.";
        return message;
    }

    public static ChatMessage createLeaveMessage(ChatRoom room, User sender) {
        ChatMessage message = new ChatMessage();
        message.room = room;
        message.sender = sender;
        message.messageType = MessageType.LEAVE;
        message.content = sender.getNickname() + "님이 퇴장하셨습니다.";
        return message;
    }

}