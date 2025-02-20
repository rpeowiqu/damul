package com.damul.api.common.util;

import lombok.extern.slf4j.Slf4j;
import org.openkoreantext.processor.KoreanPosJava;
import org.openkoreantext.processor.OpenKoreanTextProcessor;
import org.openkoreantext.processor.tokenizer.KoreanTokenizer;
import org.springframework.stereotype.Component;
import scala.collection.JavaConverters;
import scala.collection.Seq;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
public class IngredientNormalizerUtil {

    public String normalize(String originalName) {
        if (originalName == null) return null;

        // 1. 기본 전처리 (단위, 괄호 등 제거)
        String cleaned = preprocess(originalName);
        log.debug("전처리 후: {}", cleaned);

        // 2. 형태소 분석
        CharSequence normalized = OpenKoreanTextProcessor.normalize(cleaned);
        Seq<KoreanTokenizer.KoreanToken> tokens = OpenKoreanTextProcessor.tokenize(normalized);

        // 디버깅을 위한 토큰 출력
        JavaConverters.seqAsJavaList(tokens).forEach(token ->
                log.debug("토큰: {}, 품사: {}", token.text(), token.pos()));

        // 3. 명사만 추출하고 마지막 명사 반환
        List<String> nouns = JavaConverters.seqAsJavaList(tokens)
                .stream()
                .filter(token -> {
                    String pos = token.pos().toString();
                    return pos.equals(KoreanPosJava.Noun.toString()) ||
                            pos.equals(KoreanPosJava.ProperNoun.toString());
                })
                .map(token -> token.text())
                .collect(Collectors.toList());

        // 마지막 명사 반환 (일반적으로 한국어에서 마지막 명사가 주요 식재료)
        return nouns.isEmpty() ? "" : nouns.get(nouns.size() - 1);
    }

    private String preprocess(String text) {
        // 1. 괄호와 내용 제거
        String cleaned = text.replaceAll("\\([^)]*\\)", "");

        // 2. 숫자와 단위 제거
        cleaned = cleaned.replaceAll("\\d+([.]\\d+)?\\s*(g|kg|ml|l|개|마리|장|봉|그램|팩|입|box|Box|BOX)", "");

        // 3. 등급 표시 제거
        cleaned = cleaned.replaceAll("\\d*\\+?등급", "");

        // 4. 브랜드 표시 제거 (P, L 등)
        cleaned = cleaned.replaceAll("^[pPlL]\\s*", "");

        // 5. 특수문자 제거하고 공백으로 변경
        cleaned = cleaned.replaceAll("[^가-힣a-zA-Z\\s]", " ");

        // 6. 연속된 공백 제거
        cleaned = cleaned.replaceAll("\\s+", " ");

        return cleaned.trim();
    }
}