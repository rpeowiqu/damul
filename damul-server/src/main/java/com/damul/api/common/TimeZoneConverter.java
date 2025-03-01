package com.damul.api.common;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Component
public class TimeZoneConverter {

    public LocalDateTime convertSeoulToUTC(LocalDateTime seoulDateTime) {
        ZoneId seoulZone = ZoneId.of("Asia/Seoul");
        ZonedDateTime seoulZoned = seoulDateTime.atZone(seoulZone);
        return seoulZoned.withZoneSameInstant(ZoneId.of("UTC")).toLocalDateTime();
    }

    public LocalDateTime convertUtcToSeoul(LocalDateTime utcTime) {
        return utcTime
                .atZone(ZoneId.of("UTC"))
                .withZoneSameInstant(ZoneId.of("Asia/Seoul"))
                .toLocalDateTime();
    }

}
