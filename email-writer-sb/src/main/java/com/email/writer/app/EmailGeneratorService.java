package com.email.writer.app;

import com.email.writer.app.EmailRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

@Service
public class EmailGeneratorService {
    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailReply(EmailRequest emailRequest){
        // Build prompt
        String prompt = buildPrompt(emailRequest);

        // Craft email request body matching Gemini structure
        Map<String, Object> requetBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        // Do request, pass the body payload, and get a response
        String response = webClient.post()
                .uri(geminiApiUrl + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requetBody) // <-- FIXED: Added missing request body
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // Return parsed response
        return extractResponseContent(response);
    }

    private String extractResponseContent(String response){
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        }
        catch (Exception e){
            return "Error Processing request: " + e.getMessage();
        }
    }

    public String buildPrompt(EmailRequest emailRequest){
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email reply for the following email content. Please don't generate a subject line. ");

        // FIXED: Added leading and trailing spaces to prevent squished text
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()){
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone. ");
        }

        // FIXED: Moved outside the conditional block so the original email is always included
        prompt.append("\nOriginal email: \n").append(emailRequest.getEmailContent());

        return prompt.toString();
    }
}